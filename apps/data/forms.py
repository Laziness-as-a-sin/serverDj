from django import forms

from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import datetime #for checking renewal date range.
from django.contrib.auth.models import User
from django.forms import MultipleChoiceField, BooleanField, IntegerField
from .models import City, Education, Profession, Disability, Skill
from multiselectfield import MultiSelectField


class reg_check(forms.Form):
    username = forms.CharField(max_length=200)
    name1 = forms.CharField(help_text='фамилия', max_length=200)
    name2 = forms.CharField(help_text='имя', max_length=200)
    name3 = forms.CharField(help_text='отчество', max_length=200)
    email = forms.EmailField(max_length=200)
    password = forms.CharField(max_length=200, widget=forms.PasswordInput)
    password_repeat = forms.CharField(max_length=200, widget=forms.PasswordInput)

    def clean_username(self):
        name = self.cleaned_data['username']
        
        if User.objects.filter(username=name):
            raise ValidationError(_('Логин занят!'))
        
        return name

    def clean(self):
        cleaned_data = super(reg_check, self).clean()
        pass1 = cleaned_data.get("password")
        pass2 = cleaned_data.get("password_repeat")

        if pass1 != pass2:
            msg = "Пароли должны совпадать!"
            self.add_error('password', msg)


class index_form(forms.Form):

    choices = [("0", _("Владивостотский округ")), ("1", _("Дальний восток")),("2", _("Приморский край")), ("3", _("Хабаровский край"))]
    region = forms.ChoiceField(choices=choices,label=_("Регион"), required=False)


    choices_city = tuple(City.objects.values_list('id', 'name'))
    
    region_or_location = forms.ChoiceField(choices=choices_city,label=_("Город или район"), required=False)


    relocation_check = forms.BooleanField(label=_("Возможность переезда"), required=False)
    region_relocation = forms.ChoiceField(choices=choices_city,label=_("Регион переезда"), required=False)
    

    choices_edu_level = tuple(Education.objects.values_list('id', 'name'))
    edu_level = forms.ChoiceField(choices=choices_edu_level,label=_("Уровень"), required=False)


    choices_edu_profession = tuple(Profession.objects.values_list('id', 'name'))
    edu_profession = forms.ChoiceField(choices=choices_edu_profession,label=_("Специальность"), required=False)

    
    experience = forms.MultipleChoiceField(choices = (("0", "20 лет пахал на заводе"),), widget=forms.CheckboxSelectMultiple(),required=False, label=_("Опыт работы(Еще хз как дожно вызлядеть)"))

    age = forms.IntegerField(label=_("Возраст"), required=False)

    
    choices_skills = tuple(Skill.objects.values_list('id', 'name'))
    skills = MultipleChoiceField(choices = choices_skills, label=_("Ключевые навыки"), required=False)


    choices_disability = tuple(Disability.objects.values_list('id', 'name'))
    disability = MultipleChoiceField(choices = choices_disability, label=_("Ограничения"), required=False)

    
