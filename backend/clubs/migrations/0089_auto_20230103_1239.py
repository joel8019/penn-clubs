# Generated by Django 3.2.16 on 2023-01-03 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0088_adminnote"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="historicalclub",
            options={
                "get_latest_by": ("history_date", "history_id"),
                "ordering": ("-history_date", "-history_id"),
                "verbose_name": "historical club",
                "verbose_name_plural": "historical clubs",
            },
        ),
        migrations.AddField(
            model_name="applicationsubmission",
            name="notified",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="applicationsubmission",
            name="reason",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="clubapplication",
            name="acceptance_email",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="clubapplication",
            name="rejection_email",
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name="applicationsubmission",
            name="status",
            field=models.IntegerField(
                choices=[
                    (1, "Pending"),
                    (2, "Rejected after written application"),
                    (3, "Rejected after interview(s)"),
                    (4, "Accepted"),
                ],
                default=1,
            ),
        ),
        migrations.AlterField(
            model_name="historicalclub",
            name="history_date",
            field=models.DateTimeField(db_index=True),
        ),
    ]
