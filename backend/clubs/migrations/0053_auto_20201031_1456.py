# Generated by Django 3.1.2 on 2020-10-31 18:56

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0052_auto_20201025_1428"),
    ]

    operations = [
        migrations.AlterField(
            model_name="advisor",
            name="phone",
            field=phonenumber_field.modelfields.PhoneNumberField(
                blank=True, max_length=128, region=None
            ),
        ),
    ]
