# Generated by Django 3.1.6 on 2021-08-27 18:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0080_auto_20210824_0120"),
    ]

    operations = [
        migrations.AlterField(
            model_name="applicationsubmission",
            name="application",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="submissions",
                to="clubs.clubapplication",
            ),
        ),
        migrations.AlterField(
            model_name="applicationsubmission",
            name="committee",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="submissions",
                to="clubs.applicationcommittee",
            ),
        ),
    ]
