# Generated by Django 3.1.7 on 2021-03-15 05:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0010_auto_20210315_1437'),
    ]

    operations = [
        migrations.RenameField(
            model_name='firm',
            old_name='discription',
            new_name='description',
        ),
    ]
