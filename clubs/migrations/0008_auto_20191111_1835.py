# Generated by Django 2.2.6 on 2019-11-11 18:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clubs', '0007_auto_20191103_1843'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='club',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='clubs.Club'),
        ),
        migrations.AddField(
            model_name='asset',
            name='name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
