from django.http import HttpResponse
from django.shortcuts import render
from django.template.context_processors import csrf
from .models import City, Profile, Profession, Disability
from django.contrib.auth.models import User
from .forms import reg_check, index_form
from django.http import JsonResponse
import logging
from django.db.models import Q

def index(request):
    usernames = User.objects.all().values("username")
    form = index_form(request.POST)
    return render(request, 'data/index.html', {'form': form})

def sr(request):
    return HttpResponse("Здравствуй, Мир")

def registration_profile(request):
    form = reg_check

    return render(request, 'data/registration_profile.html', {'form': form})


def registration_profile_form(request):

    if request.method == 'POST':
        # return HttpResponse(request.POST)
        # # Создаем экземпляр формы и заполняем данными из запроса (связывание, binding):
        form = reg_check(request.POST)

        # Проверка валидности данных формы:
        if form.is_valid():
            
            temp = User(username='Noname', email='example@mail.com', password = str(form.cleaned_data['password']))
            temp.username = form.cleaned_data['username']
            # temp.Profile.name1 = form.cleaned_data['name1']
            # temp.Profile.name2 = form.cleaned_data['name2']
            # temp.Profile.name3 = form.cleaned_data['name3']
            temp.email = form.cleaned_data['email']
            temp.save()

            # Переход по адресу 'all-borrowed':
            return HttpResponse("Save, sucsessfull!")

    # Если это GET (или какой-либо еще), создать форму по умолчанию.
    else:
        form = reg_check

    return render(request, 'data/registration_profile.html', {'form': form})
    
def getUserInfo(request):
    if request.method == "GET" and request.is_ajax():

        region = request.GET.get("id_region")
        region_or_location = request.GET.get("id_region_or_location")
        region_relocation = request.GET.get("id_region_relocation")

        edu_level = request.GET.get("id_edu_level")
        edu_profession = request.GET.get("id_edu_profession")
        experience = request.GET.get("id_experience")
        age = request.GET.get("id_age")
        skills = request.GET.get("id_skills")
        disability = request.GET.getlist("id_disability[]")
        print(request.GET.keys(), "******", disability)
        
        experience = request.GET.get("id_experience")


        try:
            prof = Profile.objects.exclude(disability__in = disability)
            # temp = Profile.objects.filter(city = region_or_location, education= edu_level)
            # people = Profile.objects.filter(Q(title__icontains = ) | 
            #              Q(tags__icontains = )  |
            #              Q(tags__title__icontains = search)).count()
        except:
            return JsonResponse({"success":False}, status=400)

        user_info = {
            "prof_name": prof[1].name1,
            "prof_desc": prof[1].name2,
            "suitable_people": prof.count()
        }
        return JsonResponse({"user_info":user_info}, status=200)
    return JsonResponse({"success":False}, status=400)
