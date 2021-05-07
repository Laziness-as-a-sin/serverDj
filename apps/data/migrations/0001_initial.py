# Generated by Django 3.1.7 on 2021-05-07 06:50

import data.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='название города')),
            ],
        ),
        migrations.CreateModel(
            name='Disability',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='название ограничения')),
            ],
        ),
        migrations.CreateModel(
            name='DisabilityGroups',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='группа инвалидности')),
                ('description', models.TextField(blank=True, verbose_name='описание')),
            ],
        ),
        migrations.CreateModel(
            name='DysfunctionsBody',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='вид нарушения функций организма')),
                ('description', models.TextField(blank=True, verbose_name='описание')),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='образование')),
            ],
        ),
        migrations.CreateModel(
            name='EmploymentType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='тип занятости')),
            ],
        ),
        migrations.CreateModel(
            name='Firm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='название фирмы')),
                ('description', models.TextField(default=data.models.Firm.contact_default, verbose_name='описание фирмы')),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='название профессии')),
                ('description', models.TextField(default=data.models.Profession.contact_default, verbose_name='описание профессии')),
                ('boundProfession', models.ManyToManyField(blank=True, related_name='_profession_boundProfession_+', to='data.Profession', verbose_name='связанные профессии')),
                ('disability', models.ManyToManyField(to='data.Disability')),
                ('education', models.ManyToManyField(to='data.Education')),
            ],
        ),
        migrations.CreateModel(
            name='RestrictionsCategoriesLife',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='ограничения основных категорий жизнедеятельности')),
                ('description', models.TextField(blank=True, verbose_name='описание')),
            ],
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='график работы')),
            ],
        ),
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='название ключевого навыка')),
            ],
        ),
        migrations.CreateModel(
            name='WorkPlace',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default=data.models.WorkPlace.contact_default, max_length=200, verbose_name='Title work place')),
                ('location', models.CharField(default='Державина 15', max_length=200, verbose_name='Адрес')),
                ('min_salary', models.IntegerField(null=True, verbose_name='минимальная зарплата')),
                ('max_salary', models.IntegerField(null=True, verbose_name='максимальная зарплата')),
                ('city', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='data.city', verbose_name='город')),
                ('disability', models.ManyToManyField(blank=True, to='data.Disability', verbose_name='ограничения')),
                ('disability_group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='data.disabilitygroups', verbose_name='группа инвалидности')),
                ('dysfunctions_body', models.ManyToManyField(blank=True, to='data.DysfunctionsBody', verbose_name='физические ограничения')),
                ('education', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='data.education', verbose_name='образование')),
                ('employment_type', models.ManyToManyField(blank=True, to='data.EmploymentType', verbose_name='тип занятости')),
                ('firm', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='data.firm', verbose_name='фирма')),
                ('liked_by_profile', models.ManyToManyField(blank=True, related_name='liked_by_profile', to=settings.AUTH_USER_MODEL, verbose_name='Пользователи которые лайкнули')),
                ('profession', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='data.profession', verbose_name='профессия')),
                ('profile_liked', models.ManyToManyField(blank=True, related_name='profile_liked', to=settings.AUTH_USER_MODEL, verbose_name='Пользователи лайкнутые работадателем')),
                ('restrictions_categories_life', models.ManyToManyField(blank=True, to='data.RestrictionsCategoriesLife', verbose_name='ограничение категорий жизнедеятельности')),
                ('schedule', models.ManyToManyField(blank=True, to='data.Schedule', verbose_name='график работы')),
                ('skill', models.ManyToManyField(blank=True, to='data.Skill', verbose_name='навыки')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True, max_length=500, verbose_name='окортко о себе')),
                ('sex', models.IntegerField(blank=True, default=1, verbose_name='пол')),
                ('birth_date', models.DateField(blank=True, null=True, verbose_name='дата рождения')),
                ('location', models.CharField(default='Державина 15', max_length=30, verbose_name='адрес')),
                ('name1', models.CharField(blank=True, max_length=200, verbose_name='фамилия')),
                ('name2', models.CharField(blank=True, max_length=200, verbose_name='имя')),
                ('name3', models.CharField(blank=True, max_length=200, verbose_name='отчество')),
                ('desired_salary', models.IntegerField(blank=True, null=True, verbose_name='желаемая зарплата')),
                ('city', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='data.city')),
                ('desired_position', models.ManyToManyField(blank=True, related_name='desired_position', to='data.Profession', verbose_name='желаемые профессии')),
                ('desired_skill', models.ManyToManyField(blank=True, related_name='desired_skills', to='data.Skill', verbose_name='желаемые навыки')),
                ('disability', models.ManyToManyField(blank=True, to='data.Disability')),
                ('disability_group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='data.disabilitygroups', verbose_name='группа инвалидности')),
                ('dysfunctions_body', models.ManyToManyField(blank=True, to='data.DysfunctionsBody', verbose_name='физические ограничения')),
                ('education', models.ManyToManyField(blank=True, to='data.Education')),
                ('profession', models.ManyToManyField(blank=True, related_name='profession', to='data.Profession', verbose_name='профессии по образованию')),
                ('restrictions_categories_life', models.ManyToManyField(blank=True, to='data.RestrictionsCategoriesLife', verbose_name='ограничение категорий жизнедеятельности')),
                ('skills', models.ManyToManyField(blank=True, related_name='skills', to='data.Skill', verbose_name='навыки')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('work_experience', models.ManyToManyField(blank=True, related_name='work_experience', to='data.Profession', verbose_name='опыт работы')),
            ],
        ),
    ]
