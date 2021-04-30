# Generated by Django 3.1.7 on 2021-04-30 04:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0021_auto_20210430_1336'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='work_experience',
        ),
        migrations.RemoveField(
            model_name='workplace',
            name='work_experience',
        ),
        migrations.AddField(
            model_name='profile',
            name='disability_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='data.disabilitygroups', verbose_name='группа инвалидности'),
        ),
        migrations.AddField(
            model_name='profile',
            name='dysfunctions_body',
            field=models.ManyToManyField(blank=True, to='data.DysfunctionsBody'),
        ),
        migrations.AddField(
            model_name='profile',
            name='restrictions_categories_life',
            field=models.ManyToManyField(blank=True, to='data.RestrictionsCategoriesLife'),
        ),
        migrations.DeleteModel(
            name='WorkExperience',
        ),
    ]