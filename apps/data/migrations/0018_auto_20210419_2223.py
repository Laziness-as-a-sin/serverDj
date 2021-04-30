# Generated by Django 3.1.7 on 2021-04-19 12:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0017_auto_20210416_1835'),
    ]

    operations = [
        migrations.AddField(
            model_name='workplace',
            name='location',
            field=models.CharField(default='Державина 15', max_length=200, verbose_name='Адрес'),
        ),
        migrations.AlterField(
            model_name='workplace',
            name='city',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='data.city', verbose_name='город'),
        ),
    ]