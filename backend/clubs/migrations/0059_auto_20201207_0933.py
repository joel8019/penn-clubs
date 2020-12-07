# Generated by Django 3.1.3 on 2020-12-07 14:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("clubs", "0058_badge_visible"),
    ]

    operations = [
        migrations.CreateModel(
            name="ClubFair",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.TextField()),
                ("organization", models.TextField()),
                ("contact", models.TextField()),
                ("time", models.TextField(blank=True)),
                ("information", models.TextField()),
                ("registration_information", models.TextField()),
                ("start_time", models.DateTimeField()),
                ("end_time", models.DateTimeField()),
                ("registration_end_time", models.DateTimeField()),
            ],
        ),
        migrations.RemoveField(model_name="club", name="fair",),
        migrations.RemoveField(model_name="club", name="fair_on",),
        migrations.RemoveField(model_name="historicalclub", name="fair",),
        migrations.RemoveField(model_name="historicalclub", name="fair_on",),
        migrations.AddField(
            model_name="school",
            name="is_graduate",
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="ClubFairRegistration",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "club",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="clubs.club"),
                ),
                (
                    "fair",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="clubs.clubfair"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="clubfair",
            name="participating_clubs",
            field=models.ManyToManyField(
                blank=True, through="clubs.ClubFairRegistration", to="clubs.Club"
            ),
        ),
    ]
