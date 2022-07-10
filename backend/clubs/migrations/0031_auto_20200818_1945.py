# Generated by Django 3.1 on 2020-08-18 23:45

import django.db.models.deletion
import simple_history.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("clubs", "0030_auto_20200818_1835"),
    ]

    operations = [
        migrations.AddField(
            model_name="club", name="ghost", field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name="HistoricalClub",
            fields=[
                (
                    "id",
                    models.IntegerField(
                        auto_created=True, blank=True, db_index=True, verbose_name="ID"
                    ),
                ),
                ("approved", models.BooleanField(default=None, null=True)),
                ("approved_comment", models.TextField(blank=True, null=True)),
                ("approved_on", models.DateTimeField(blank=True, null=True)),
                ("fair", models.BooleanField(default=False)),
                ("code", models.SlugField(max_length=255)),
                ("active", models.BooleanField(default=False)),
                ("name", models.CharField(max_length=255)),
                ("subtitle", models.CharField(blank=True, max_length=255)),
                ("description", models.TextField(blank=True)),
                ("founded", models.DateField(blank=True, null=True)),
                (
                    "size",
                    models.IntegerField(
                        choices=[(1, "1-20"), (2, "21-50"), (3, "51-100"), (4, "101+")],
                        default=1,
                    ),
                ),
                ("email", models.EmailField(blank=True, max_length=254, null=True)),
                ("facebook", models.URLField(blank=True, null=True)),
                ("website", models.URLField(blank=True, null=True)),
                ("twitter", models.URLField(blank=True, null=True)),
                ("instagram", models.URLField(blank=True, null=True)),
                ("linkedin", models.URLField(blank=True, null=True)),
                ("github", models.URLField(blank=True, null=True)),
                ("youtube", models.URLField(blank=True, null=True)),
                ("how_to_get_involved", models.TextField(blank=True)),
                (
                    "application_required",
                    models.IntegerField(
                        choices=[
                            (1, "No Application Required"),
                            (2, "Application Required For Some Positions"),
                            (3, "Application Required For All Positions"),
                        ],
                        default=3,
                    ),
                ),
                ("accepting_members", models.BooleanField(default=False)),
                ("listserv", models.CharField(blank=True, max_length=255)),
                ("image", models.CharField(blank=True, max_length=100, null=True)),
                ("created_at", models.DateTimeField(blank=True, editable=False)),
                ("updated_at", models.DateTimeField(blank=True, editable=False)),
                ("ghost", models.BooleanField(default=False)),
                ("history_id", models.AutoField(primary_key=True, serialize=False)),
                ("history_date", models.DateTimeField()),
                ("history_change_reason", models.CharField(max_length=100, null=True)),
                (
                    "history_type",
                    models.CharField(
                        choices=[("+", "Created"), ("~", "Changed"), ("-", "Deleted")],
                        max_length=1,
                    ),
                ),
                (
                    "approved_by",
                    models.ForeignKey(
                        blank=True,
                        db_constraint=False,
                        null=True,
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "history_user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "historical club",
                "ordering": ("-history_date", "-history_id"),
                "get_latest_by": "history_date",
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
    ]
