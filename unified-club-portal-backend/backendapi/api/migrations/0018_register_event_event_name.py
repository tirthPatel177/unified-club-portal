# Generated by Django 3.2.5 on 2021-07-17 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_register_event'),
    ]

    operations = [
        migrations.AddField(
            model_name='register_event',
            name='event_name',
            field=models.CharField(default='', max_length=250),
        ),
    ]