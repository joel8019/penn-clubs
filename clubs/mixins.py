import datetime
from collections import OrderedDict

from django.core.exceptions import FieldDoesNotExist, MultipleObjectsReturned, ObjectDoesNotExist
from django.db.models import BooleanField, ManyToManyField
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.utils.serializer_helpers import ReturnDict, ReturnList


class ManyToManySaveMixin(object):
    """
    Mixin for serializers that saves ManyToMany fields by looking up related models.

    In the Meta class, create a new attribute called "save_related_fields" in the Meta
    class that represents the ManyToMany fields that should have save behavior.

    You can also specify a dictionary instead of a string, with the following fields:
        - field (string, required): The field to implement saving behavior on.
        - create (bool): If true, create the related model if it does not exist.
          Otherwise, raise an exception if the user links to a nonexistent object.
    """

    def _lookup_item(self, model, field_name, item, create=False):
        if create:
            obj, _ = model.objects.get_or_create(**item)
            return obj
        else:
            try:
                return model.objects.get(**item)
            except ObjectDoesNotExist:
                raise serializers.ValidationError({
                    field_name: ['The object with these values does not exist: {}'.format(item)]
                }, code='invalid')
            except MultipleObjectsReturned:
                raise serializers.ValidationError({
                    field_name: ['Multiple objects exist with these values: {}'.format(item)]
                })

    def save(self):
        m2m_to_save = getattr(self.Meta, 'save_related_fields', [])

        # turn all entries into dict configs
        for i, m2m in enumerate(m2m_to_save):
            if not isinstance(m2m, dict):
                m2m_to_save[i] = {
                    'field': m2m,
                    'create': False
                }

        # remove m2m from validated data and save
        m2m_lists = {}
        for m2m in m2m_to_save:
            create = m2m.get('create', False)
            field_name = m2m['field']

            field = self.fields[field_name]
            if isinstance(field, serializers.ListSerializer):
                m2m['many'] = True
                model = field.child.Meta.model
                m2m_lists[field_name] = []
                items = self.validated_data.pop(field_name, None)
                if items is None:
                    continue
                for item in items:
                    m2m_lists[field_name].append(self._lookup_item(model, field_name, item, create))
            else:
                m2m['many'] = False
                model = field.Meta.model
                item = self.validated_data.pop(field_name, None)
                m2m_lists[field_name] = self._lookup_item(model, field_name, item, create)

        obj = super(ManyToManySaveMixin, self).save()

        # link models to this model
        updates = []
        for m2m in m2m_to_save:
            field = m2m['field']
            value = m2m_lists[field]
            if m2m['many']:
                getattr(obj, field).set(value)
            else:
                setattr(obj, field, value)
                updates.append(field)

        if updates:
            obj.save(update_fields=updates)

        return obj


class XLSXFormatterMixin(object):
    """
    Mixin for views that formats xlsx output to a more readable format.
    Will only apply to views that implement a get_serializer_class method.

    You can insert "format_{field}_for_spreadsheet" methods in your serializer class
    that accept a single argument (the cell value) and returns the formatted value.

    Changes the default filename to include the date and time of creation.
    Changes the default column header to be bolded.
    """

    def _format_header_value(self, key):
        """
        Format the text displayed in the column header.
        """
        return key.replace('_', ' ').title()

    def _many_to_many_individual_formatter(self, value):
        """
        Take in an individual object generated by a ManyToMany serializer and format it.
        If there is a single field in the dictionary, return that. Otherwise, return the
        first field that is not the id field.
        """
        if isinstance(value, dict):
            if len(value) == 1:
                return next(value.values())
            elif len(value) > 1:
                return next(v for k, v in value.items() if not k == 'id')
        return str(value)

    def _many_to_many_formatter(self, value):
        """
        Take in output generated by a ManyToMany serializer and format it.
        """
        if isinstance(value, list):
            return ', '.join(self._many_to_many_individual_formatter(v) for v in value)
        return value

    def _lookup_field_formatter(self, field):
        """
        Return a method that can format the field given the name of the field.
        """
        # if there is no model serializer, don't format
        try:
            serializer = self.get_serializer_class()
        except AttributeError:
            return lambda x: x

        if not isinstance(serializer, serializers.SerializerMetaclass):
            return lambda x: x

        # allow serializer to override field formatting
        key = 'format_{}_for_spreadsheet'.format(field)
        if hasattr(serializer, key):
            return lambda x: getattr(serializer, key)(serializer, x)

        # lookup column type from serializer
        if field in serializer._declared_fields:
            serializer_field_object = serializer._declared_fields[field]
            if isinstance(serializer_field_object, serializers.SerializerMethodField):
                return lambda x: x

        # lookup column type from model
        model = serializer.Meta.model
        try:
            field_object = model._meta.get_field(field)
        except FieldDoesNotExist:
            # if model field lookup fails, rely on serializer field
            if isinstance(serializer_field_object, serializers.BooleanField):
                return lambda x: str(bool(x))
            return lambda x: x

        # format based on field type
        if isinstance(field_object, ManyToManyField):
            return self._many_to_many_formatter
        elif isinstance(field_object, BooleanField):
            return lambda x: str(bool(x))
        elif hasattr(field_object, 'choices') and field_object.choices is not None:
            choices = dict(field_object.choices)
            return lambda x: choices.get(x, 'Unknown')
        else:
            return lambda x: x

    def _format_cell(self, key, value):
        """
        Format a cell in the exported Excel spreadsheet given (column name, cell value).
        Returns (new column name, new cell value). Looks up formatting information using
        the modal obtained from the serializer.
        """
        new_key = self._format_header_value(key)
        # cache column formatter by column name
        if key not in self._field_dict:
            self._field_dict[key] = self._lookup_field_formatter(key)
        return (new_key, self._field_dict[key](value))

    def get_filename(self):
        """
        Returns a custom filename for the spreadsheet.
        """
        return 'report-{}.xlsx'.format(datetime.datetime.now().strftime('%Y%m%d-%H%M'))

    def get_column_header(self):
        """
        Return the style of the column header for an Excel export.
        By default, bold the column header.
        """
        return {
            'style': {
                'font': {
                    'bold': True
                }
            }
        }

    def finalize_response(self, request, response, *args, **kwargs):
        """
        If the requested format is a spreadsheet, format the cell values before
        rendering the spreadsheet. Also perform the functionality of XLSXFileMixin.
        """
        response = super(XLSXFormatterMixin, self).finalize_response(
            request, response, *args, **kwargs
        )

        # If this is a spreadsheet response, intercept and format.
        if isinstance(response, Response) and response.accepted_renderer.format == 'xlsx':
            self._field_dict = {}
            if isinstance(response.data, ReturnList):
                new_data = [
                    OrderedDict([self._format_cell(k, v) for k, v in row.items()]) for row in response.data
                ]
                response.data = ReturnList(new_data, serializer=response.data.serializer)
            elif isinstance(response.data, ReturnDict):
                new_data = OrderedDict([self._format_cell(k, v) for k, v in response.data.items()])
                response.data = ReturnDict(new_data, serializer=response.data.serializer)
            elif isinstance(response.data, dict):
                # If this is not a proper spreadsheet response (ex: object does not exist),
                # then return the response in JSON format.
                response = Response(response.data)
                response.accepted_renderer = JSONRenderer()
                response.accepted_media_type = 'application/json'
                response.renderer_context = {}
                return response

            response['Content-Disposition'] = 'attachment; filename={}'.format(
                self.get_filename()
            )

        return response
