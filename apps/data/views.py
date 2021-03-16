from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template.context_processors import csrf
from .models import City, Profile, Profession, Disability, Firm, WorkPlace, EmploymentType, Schedule, Skill, Education
from django.contrib.auth.models import User
from .forms import index_form, workPlace_form, registration_firm_form, registration_profile_form, profile_form
from django.http import JsonResponse
from django.db.models import Q


def index(request):
    usernames = User.objects.all().values("username")
    form = index_form(request.POST)
    return render(request, 'data/index.html', {'form': form})


def sr(request):
    return HttpResponse("Здравствуй, Мир")


def testPage(request):
    return render(request, 'data/test_page.html', {'form': workPlace_form})


def registrationProfile(request):
    if request.method == 'POST':
        form = registration_profile_form(request.POST)

        if form.is_valid():
            
            tempUser = User(username=form.cleaned_data['username'], email=form.cleaned_data['email'], password = form.cleaned_data['password'])
            tempUser.save()
            tempUser.set_password(tempUser.password)
            tempUser.save()

            tempProfile = Profile(user=tempUser, name1=form.cleaned_data['name1'], name2=form.cleaned_data['name2'], name3=form.cleaned_data['name3'])
            tempProfile.save()

            return HttpResponse("Save, sucsessfull!")

    else:
        form = registration_profile_form

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

        user_info = {
            "target_mismatches": temp_dict,
            "prof_desc": number_mismatches_dict
        }

        return JsonResponse({"user_info":user_info}, status=200)
    return JsonResponse({"success":False}, status=400)


def testUpdate(request):
    print("In 1")
    if request.method == "GET" and request.is_ajax():
        id_profession = request.GET.get("id_profession")
        profession = Profession.objects.get(pk=id_profession)
        profession_disability = (list(map(int, profession.disability.values_list("id",  flat=True)))) 
        return JsonResponse({"user_info":profession_disability}, status=200)
    return JsonResponse({"success":False}, status=400)


def registrationFirm(request):
    form = registration_firm_form
    if request.method == 'POST':
        form = registration_firm_form(request.POST)

        if form.is_valid():
            tempUser = User(username='Noname', email='example@mail.com', password = str(form.cleaned_data['password']))
            tempUser.username = form.cleaned_data['username']

            tempUser.email = form.cleaned_data['email']
            tempUser.save()
            tempUser.set_password(tempUser.password)
            tempUser.save()

            tempFirm = Firm(user=tempUser, name=form.cleaned_data['name'], description=form.cleaned_data['description'])
            tempFirm.save()

            return HttpResponse("Save, sucsessfull!"+form.cleaned_data['username'])

    else:
        form = registration_firm_form
    return render(request, 'data/registration_firm.html', {'form': form})


def personalArea(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'firm'):
            return redirect('firm/')
        if hasattr(request.user, 'profile'):
            return redirect('profile/')
        return HttpResponse("Как ты сюда попал?!!")
    return HttpResponse("Как ты сюда попал?!")


def personalAreaFirm(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'firm'):
            if request.method == 'POST':
                print()
                form = workPlace_form(request.POST)

                if form.is_valid():
                    tempWorkPlace = WorkPlace(name=form.cleaned_data['name'])
                    
                    tempWorkPlace.firm = request.user.firm
                    tempWorkPlace.city = form.cleaned_data['city']
                    tempWorkPlace.education = form.cleaned_data['education']
                    tempWorkPlace.profession = form.cleaned_data['profession']
                    tempWorkPlace.work_experience = form.cleaned_data['work_experience']
                    tempWorkPlace.min_salary = form.cleaned_data['min_salary']
                    tempWorkPlace.max_salary = form.cleaned_data['max_salary']
                    tempWorkPlace.save()

                    for temp in form.cleaned_data['employment_type']:
                        employment_type = get_object_or_404(EmploymentType, name=temp)
                        tempWorkPlace.employment_type.add(employment_type.id)

                    for temp in form.cleaned_data['schedule']:
                        schedule = get_object_or_404(Schedule, name=temp)
                        tempWorkPlace.schedule.add(schedule.id)

                    for temp in form.cleaned_data['skill']:
                        skill = get_object_or_404(Skill, name=temp)
                        tempWorkPlace.skill.add(skill.id)

                    for temp in form.cleaned_data['disability']:
                        disability = get_object_or_404(Disability, name=temp)
                        tempWorkPlace.disability.add(disability.id)

                    tempWorkPlace.save()
                    
                    return HttpResponse("Save, sucsessfull!")
            

            if request.method == "GET" and request.is_ajax():
                city = request.GET.get("id_city", "")
                education = request.GET.get("id_education")
                profession = request.GET.get("id_profession")
                skill = request.GET.getlist("id_skill[]")
                disability = request.GET.getlist("id_disability[]") 

                temp_dict = {"city":0, "education":0, "profession":0, "skill":0, "disability":0} 
                users = Profile.objects.all()
            
                number_mismatches_dict = [0] * 6
                print(city, education, profession, skill, disability)

                for user in users:
                    number_mismatches = 0
                    if city and user.city_id == int(city):
                        temp_dict["city"] += 1 
                    else:
                        number_mismatches += 1

                    if  set(list(map(int, education))).issubset(user.education.values_list("id",  flat=True)):         
                        temp_dict["education"] += 1 
                    else:
                        number_mismatches += 1

                    if profession and int(profession) in user.profession.values_list("id",  flat=True):
                            temp_dict["profession"] += 1 
                    else:
                        number_mismatches += 1

                    if set(list(map(int, skill))).issubset(user.skills.values_list("id",  flat=True)):
                        temp_dict["skill"] += 1 
                    else:
                        number_mismatches += 1

                    if not set(list(map(int, disability))).issubset(user.disability.values_list("id",  flat=True)) or list(map(int, disability)) == []:
                        temp_dict["disability"] += 1 
                    else:
                        number_mismatches += 1

                    number_mismatches_dict[number_mismatches] += 1

                user_info = {
                    "target_mismatches": temp_dict,
                    "prof_desc": number_mismatches_dict
                }
                return JsonResponse({"user_info":user_info}, status=200)
            else:
                form = workPlace_form
            
            return render(request, 'data/personal_area_firm.html', {'form': form})

        return HttpResponse("Как ты сюда попал?!!")
    return HttpResponse("Как ты сюда попал?!")


def personalAreaProfile(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'profile'):

            if request.method == "GET" and request.is_ajax():
                city = request.GET.get("id_city", "")
                education = request.GET.getlist("id_education[]")
                profession = request.GET.getlist("id_profession[]")
                skill = request.GET.getlist("id_skill[]")
                disability = request.GET.getlist("id_disability[]") 

                temp_dict = {"disability":0, "city":0, "education":0, "profession":0, "skill":0}
                work_places = WorkPlace.objects.all()

                number_mismatches_dict = [0] * 6
                print(city, education, profession, skill, disability)

                for place in work_places:
                    number_mismatches = 0
                    if city and place.city_id == int(city):
                        temp_dict["city"] += 1 
                    else:
                        number_mismatches += 1

                    if place.education.id in list(map(int, education)):         
                        temp_dict["education"] += 1 
                    else:
                        number_mismatches += 1

                    if place.profession.id in list(map(int, profession)):
                            temp_dict["profession"] += 1 
                    else:
                        number_mismatches += 1

                    if set(place.skill.values_list("id",  flat=True)).issubset(list(map(int, skill))):
                        temp_dict["skill"] += 1 
                    else:
                        number_mismatches += 1

                    if not set(place.disability.values_list("id",  flat=True)).issubset(list(map(int, disability))) or list(map(int, disability)) == []:
                        temp_dict["disability"] += 1 
                    else:
                        number_mismatches += 1
                    number_mismatches_dict[number_mismatches] += 1


                place_info = {
                    "target_mismatches": temp_dict,
                    "prof_desc": number_mismatches_dict
                }
                return JsonResponse({"place_info":place_info}, status=200)


            if request.method == 'GET':
                form = profile_form
                return render(request, 'data/personal_area_profile.html', {'form': form})

            
            if request.method == 'POST':
                print()
                form = profile_form(request.POST)
                if form.is_valid():

                    user = Profile.objects.get(user=request.user)
                    print(form.cleaned_data['birth_date'])
                    if (form.cleaned_data['description']!=""):
                        user.description = form.cleaned_data['description']
                    if (form.cleaned_data['location']!=""):
                        user.location = form.cleaned_data['location']
                    if (form.cleaned_data['birth_date']!=None):
                        user.birth_date = form.cleaned_data['birth_date']
                    if (form.cleaned_data['sex']!=None):
                        user.sex = form.cleaned_data['sex']
                    if (form.cleaned_data['city']!=""):  
                        user.city = form.cleaned_data['city']
                    if (form.cleaned_data['name1']!=""):   
                        user.name1 = form.cleaned_data['name1']
                    if (form.cleaned_data['name2']!=""):
                        user.name2 = form.cleaned_data['name2']
                    if (form.cleaned_data['name3']!=""):
                        user.name3 = form.cleaned_data['name3']
                    user.save()
                    if (form.cleaned_data['education'] !=[]):
                        user.education.clear()
                        for temp in form.cleaned_data['education']:
                            education = get_object_or_404(Education, name=temp)
                            user.education.add(education.id)
                    if (form.cleaned_data['profession'] !=[]):
                        user.profession.clear()
                        for temp in form.cleaned_data['profession']:
                            profession = get_object_or_404(Profession, name=temp)
                            user.profession.add(profession.id)
                    if (form.cleaned_data['skills'] !=[]):
                        user.skills.clear()
                        for temp in form.cleaned_data['skills']:
                            skill = get_object_or_404(Skill, name=temp)
                            user.skills.add(skill.id)
                    if (form.cleaned_data['disability'] !=[]):
                        user.disability.clear()
                        for temp in form.cleaned_data['disability']:
                            disability = get_object_or_404(Disability, name=temp)
                            user.disability.add(disability.id)

                    user.save()
                    
                    return HttpResponse("Save, sucsessfull!")
            