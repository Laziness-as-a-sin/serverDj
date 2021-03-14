from django.http import HttpResponse
from django.shortcuts import render
from django.template.context_processors import csrf
from .models import City, Profile, Profession, Disability
from django.contrib.auth.models import User
from .forms import reg_check, index_form, workPlace_form
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


def testPage(request):
    form = reg_check

    return render(request, 'data/test_page.html', {'form': workPlace_form})


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

        edu_level = request.GET.getlist("id_edu_level")
        edu_profession = request.GET.get("id_edu_profession")
        experience = request.GET.get("id_experience")
        age = request.GET.get("id_age")
        skills = request.GET.getlist("id_skills[]")
        disability = request.GET.getlist("id_disability[]")
        
        experience = request.GET.get("id_experience")


        #try:
        prof = Profile.objects.exclude(disability__in = disability)

        temp_dict = {"city":0, "education":0, "profession":0, "skills":0, "disability":0} 
        users = Profile.objects.all()
    
        number_mismatches_dict = [0] * 6
        print(region_or_location, edu_level, edu_profession, skills, disability)
        for user in users:
            number_mismatches = 0
            if user.city_id == int(region_or_location):
                temp_dict["city"] += 1 
            else:
                number_mismatches += 1

            if  set(list(map(int, edu_level))).issubset(user.education.values_list("id",  flat=True)):         
                temp_dict["education"] += 1 
            else:
                number_mismatches += 1

            if  int(edu_profession) in user.profession.values_list("id",  flat=True):
                temp_dict["profession"] += 1 
            else:
                number_mismatches += 1

            if set(list(map(int, skills))).issubset(user.skills.values_list("id",  flat=True)):
                temp_dict["skills"] += 1 
            else:
                number_mismatches += 1

            if not set(list(map(int, disability))).issubset(user.disability.values_list("id",  flat=True)) or list(map(int, disability)) == []:
                temp_dict["disability"] += 1 
            else:
                number_mismatches += 1

            number_mismatches_dict[number_mismatches] += 1
        print(temp_dict, number_mismatches_dict)




        #except:
        #    return JsonResponse({"success":False}, status=400)

        user_info = {
            "target_mismatches": temp_dict,
            "prof_desc": number_mismatches_dict
        }
        print(user_info)
        return JsonResponse({"user_info":user_info}, status=200)
    return JsonResponse({"success":False}, status=400)


def testUpdate(request):
    print("In 1")
    if request.method == "GET" and request.is_ajax():

        id_profession = request.GET.get("id_profession")
        
        profession = Profession.objects.get(pk=id_profession)
        profession_disability = (list(map(int, profession.disability.values_list("id",  flat=True)))) 
        print(profession_disability)

        return JsonResponse({"user_info":profession_disability}, status=200)
    return JsonResponse({"success":False}, status=400)
