# Generated by Django 3.2.5 on 2021-07-22 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_event_view'),
    ]

    operations = [
        migrations.AddField(
            model_name='event_view',
            name='count_views',
            field=models.IntegerField(default=0),
        ),
    ]
