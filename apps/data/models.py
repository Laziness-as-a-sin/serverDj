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
    boundProfession = models.ManyToManyField('self', blank=True, verbose_name='связанные профессии')
    description = models.TextField('описание профессии', default=contact_default)
    disability = models.ManyToManyField(Disability)
    education = models.ManyToManyField(Education)

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


class DysfunctionsBody(models.Model):
    name = models.CharField('вид нарушения функций организма', max_length=200)
    description = models.TextField('описание', blank=True)

    def __str__(self):
        return self.name


class RestrictionsCategoriesLife(models.Model):
    name = models.CharField('ограничения основных категорий жизнедеятельности', max_length=200)
    description = models.TextField('описание', blank=True)

    def __str__(self):
        return self.name


class DisabilityGroups(models.Model):
    name = models.CharField('группа инвалидности', max_length=200)
    description = models.TextField('описание', blank=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name1 = models.CharField('фамилия', max_length=200, blank=True)
    name2 = models.CharField('имя', max_length=200, blank=True)
    name3 = models.CharField('отчество', max_length=200, blank=True)
    description = models.TextField('кортко о себе', max_length=500, blank=True)
    sex = models.IntegerField('пол', blank=True, default=1)
    birth_date = models.DateField('дата рождения', null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.PROTECT, default = 1)
    location = models.CharField('адрес', max_length=30, default='Державина 15')
    education = models.ManyToManyField(Education, blank=True)
    work_experience = models.ManyToManyField(Profession, blank=True, related_name='work_experience', verbose_name='опыт работы')
    disability_group = models.ForeignKey(DisabilityGroups, verbose_name='группа инвалидности', on_delete=models.PROTECT, blank=True, null=True)
    dysfunctions_body = models.ManyToManyField(DysfunctionsBody, blank=True, verbose_name='физические ограничения')
    restrictions_categories_life = models.ManyToManyField(RestrictionsCategoriesLife, blank=True, verbose_name='ограничение категорий жизнедеятельности')
    disability = models.ManyToManyField(Disability, blank=True)
    skills = models.ManyToManyField(Skill, blank=True, related_name='skills', verbose_name='компетенции')
    profession = models.ManyToManyField(Profession, blank=True, related_name='profession', verbose_name='профессии по образованию')
    desired_position = models.ManyToManyField(Profession, blank=True, related_name='desired_position', verbose_name='желаемые профессии')
    desired_skill = models.ManyToManyField(Skill, blank=True, related_name='desired_skills', verbose_name='желаемые навыки')
    desired_salary = models.IntegerField(verbose_name='желаемая зарплата', null=True, blank=True)

    def __str__(self):
        return self.user.username

        
class WorkPlace(models.Model):
    def contact_default():
        return ""

    name = models.CharField('Title work place', max_length=200, default=contact_default, blank=True)
    firm = models.ForeignKey(Firm, verbose_name='фирма', on_delete=models.CASCADE, null=True)
    city = models.ForeignKey(City, verbose_name='город', on_delete=models.PROTECT, default=1)
    location = models.CharField('Адрес', max_length=200, default='Державина 15')
    education = models.ForeignKey(Education, verbose_name='образование', on_delete=models.PROTECT, null=True)
    profession = models.ForeignKey(Profession, verbose_name='профессия', on_delete=models.CASCADE, null=True)
    # work_experience = models.ForeignKey(WorkExperience, verbose_name='опыт работы', on_delete=models.SET_DEFAULT, default=1)
    employment_type = models.ManyToManyField(EmploymentType, verbose_name='тип занятости', blank=True)
    schedule = models.ManyToManyField(Schedule, verbose_name='график работы', blank=True)
    skill = models.ManyToManyField(Skill, verbose_name='навыки', blank=True)
    # disability_group = models.ForeignKey(DisabilityGroups, verbose_name='группа инвалидности', on_delete=models.PROTECT, blank=True, null=True)
    dysfunctions_body = models.ManyToManyField(DysfunctionsBody, blank=True, verbose_name='физические ограничения')
    restrictions_categories_life = models.ManyToManyField(RestrictionsCategoriesLife, blank=True, verbose_name='ограничение категорий жизнедеятельности')
    disability = models.ManyToManyField(Disability, verbose_name='ограничения', blank=True)
    min_salary = models.IntegerField(verbose_name='минимальная зарплата', null=True)
    max_salary = models.IntegerField(verbose_name='максимальная зарплата', null=True)
    profile_liked = models.ManyToManyField(Profile, verbose_name="Пользователи лайкнутые работадателем", blank = True, related_name='profile_liked')
    liked_by_profile = models.ManyToManyField(Profile, verbose_name="Пользователи которые лайкнули", blank = True, related_name='liked_by_profile')

    def __str__(self):
        return self.name

class Course(models.Model):
    def contact_default():
        return ""

    name = models.CharField('Название образовательной программы', max_length=200)
    description = models.TextField('Описание образовательной программы', default=contact_default)
    count = models.IntegerField(verbose_name='Количество мест')
    price = models.IntegerField(verbose_name='Стоимость обучения на 1 человека', null=True)
    def __str__(self):
        return self.name


class Univer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField('Наименование университета', max_length=200)
    course = models.ManyToManyField(Course, verbose_name='Курсы', blank=True)

    def __str__(self):
        return self.name


# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()