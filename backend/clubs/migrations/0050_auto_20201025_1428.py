# Generated by Django 3.1.2 on 2020-10-25 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0049_auto_20201023_1716'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='application_required',
            field=models.IntegerField(choices=[(1, 'Open Membership'), (3, 'Auditions Required'), (2, 'Tryouts Required'), (4, 'Application Required'), (5, 'Application and Intereview Required')], default=4),
        ),
        migrations.AlterField(
            model_name='historicalclub',
            name='application_required',
            field=models.IntegerField(choices=[(1, 'Open Membership'), (3, 'Auditions Required'), (2, 'Tryouts Required'), (4, 'Application Required'), (5, 'Application and Intereview Required')], default=4),
        ),
    ]
