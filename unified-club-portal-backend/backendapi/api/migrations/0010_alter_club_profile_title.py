# Generated by Django 3.2.5 on 2021-07-11 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_event_desc_event_event_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club_profile',
            name='title',
            field=models.CharField(max_length=150, unique=True),
        ),
    ]
