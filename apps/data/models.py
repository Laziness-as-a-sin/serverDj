from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class City(models.Model):
    name = models.CharField('название города', max_length=100)

    def __str__(self):
        return self.name


class Disability(models.Model):
    name = models.CharField('название ограничения', max_length=200)

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField('название ключевого навыка', max_length=200)

    def __str__(self):
        return self.name


class Education(models.Model):
    name = models.CharField('образование', max_length=200)

    def __str__(self):
        return self.name


class Profession(models.Model):
    def contact_default():
        return ""

    name = models.CharField('название профессии', max_length=200)
    description = models.TextField('описание профессии', default=contact_default)
    disability = models.ManyToManyField(Disability)
    education = models.ManyToManyField(Education)

    def __str__(self):
        return self.name
    

class WorkExperience(models.Model):
    name = models.CharField('опыт работы', max_length=200)

    def __str__(self):
        return self.name


class EmploymentType(models.Model):
    name = models.CharField('тип занятости', max_length=200)

    def __str__(self):
        return self.name


class Schedule(models.Model):
    name = models.CharField('график работы', max_length=200)

    def __str__(self):
        return self.name


class Firm(models.Model):
    def contact_default():
        return ""

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    name = models.CharField('название фирмы', max_length=200)
    description = models.TextField('описание фирмы', default=contact_default)

    def __str__(self):
        return self.name


class WorkPlace(models.Model):
    def contact_default():
        return ""

    name = models.CharField('Title work place', max_length=200, default=contact_default, blank=True)
    firm = models.ForeignKey(Firm, verbose_name='фирма', on_delete=models.CASCADE, null=True)
    city = models.ForeignKey(City, verbose_name='город', on_delete=models.PROTECT, null=True, blank=True)
    education = models.ForeignKey(Education, verbose_name='образование', on_delete=models.PROTECT, null=True)
    profession = models.ForeignKey(Profession, verbose_name='профессия', on_delete=models.CASCADE, null=True)
    work_experience = models.ForeignKey(WorkExperience, verbose_name='опыт работы', on_delete=models.SET_DEFAULT, default=1)
    employment_type = models.ManyToManyField(EmploymentType, verbose_name='тип занятости', blank=True)
    schedule = models.ManyToManyField(Schedule, verbose_name='график работы', blank=True)
    skill = models.ManyToManyField(Skill, verbose_name='навыки', blank=True)
    disability = models.ManyToManyField(Disability, verbose_name='ограничения', blank=True)
    min_salary = models.IntegerField(verbose_name='минимальная зарплата', null=True)
    max_salary = models.IntegerField(verbose_name='максимальная зарплата', null=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField('опыт', max_length=500, blank=True)
    location = models.CharField('адрес', max_length=30, blank=True)
    birth_date = models.DateField('дата рождения', null=True, blank=True)
    sex = models.IntegerField('пол', blank=True, default=1)
    education = models.ManyToManyField(Education, blank=True)
    city = models.ForeignKey(City, on_delete=models.PROTECT, null=True, blank=True)
    disability = models.ManyToManyField(Disability, blank=True)
    skills = models.ManyToManyField(Skill, blank=True)
    profession = models.ManyToManyField(Profession, blank=True)
    name1 = models.CharField('фамилия', max_length=200, blank=True)
    name2 = models.CharField('Имя', max_length=200, blank=True)
    name3 = models.CharField('отчество', max_length=200, blank=True)

    def __str__(self):
        return self.user.username


# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()