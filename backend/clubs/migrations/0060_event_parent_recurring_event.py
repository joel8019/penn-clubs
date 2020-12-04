# Generated by Django 3.1.2 on 2020-12-04 22:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0059_recurringevent"),
    ]

    operations = [
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
