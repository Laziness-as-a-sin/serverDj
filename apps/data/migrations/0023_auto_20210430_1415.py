# Generated by Django 3.1.7 on 2021-04-30 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0022_auto_20210430_1405'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='desired_position',
            field=models.ManyToManyField(blank=True, related_name='desired_position', to='data.Profession', verbose_name='желаемые профессии'),
        ),
        migrations.AddField(
            model_name='profile',
            name='desired_skill',
            field=models.ManyToManyField(blank=True, related_name='desired_skills', to='data.Skill', verbose_name='желаемые навыки'),
        ),
        migrations.AddField(
            model_name='profile',
            name='work_experience',
            field=models.ManyToManyField(blank=True, related_name='work_experience', to='data.Profession', verbose_name='опыт работы'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='profession',
            field=models.ManyToManyField(blank=True, related_name='profession', to='data.Profession', verbose_name='профессии'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='skills',
            field=models.ManyToManyField(blank=True, related_name='skills', to='data.Skill', verbose_name='навыки'),
        ),
    ]