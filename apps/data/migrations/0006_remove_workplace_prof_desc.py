# Generated by Django 3.1.7 on 2021-03-14 06:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0005_workplace_prof_desc'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workplace',
            name='prof_desc',
        ),
    ]