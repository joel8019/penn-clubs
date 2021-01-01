# Generated by Django 3.1.4 on 2020-12-21 13:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0065_auto_20201218_1830"),
    ]

    operations = [
        migrations.CreateModel(
            name="RecurringEvent",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="event",
            name="parent_recurring_event",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="clubs.recurringevent",
            ),
        ),
    ]