# Generated by Django 3.2.5 on 2021-07-20 15:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='register_event',
            name='event_name',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.event'),
        ),
    ]
