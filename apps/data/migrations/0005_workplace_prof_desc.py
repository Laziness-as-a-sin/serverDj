# Generated by Django 3.1.7 on 2021-03-14 06:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0004_workplace'),
    ]

    operations = [
        migrations.AddField(
            model_name='workplace',
            name='prof_desc',
            field=models.CharField(max_length=300, null=True),
        ),
    ]
