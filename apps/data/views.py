from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template.context_processors import csrf
from .models import City, Profile, Profession, Disability, Firm, WorkPlace, EmploymentType, Schedule, Skill, Education, DysfunctionsBody
from .models import RestrictionsCategoriesLife, Univer, Course
from django.contrib.auth.models import User
from .forms import index_form, workPlace_form, registration_firm_form, registration_profile_form, profile_form, personal_info_profile, registration_univer_form, add_course_by_univer_form
from django.http import JsonResponse
from django.db.models import Q
import json

def checkIsInclude(arr1, arr2):
    for a in arr2:
        for b in arr1:
            if a == b:
                return True
    return False


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

            return HttpResponse("Save, sucsessfull! "+form.cleaned_data['username'])

    else:
        form = registration_firm_form
    return render(request, 'data/registration_firm.html', {'form': form})


def personalArea(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'firm'):
            return redirect('firm/')
        if hasattr(request.user, 'profile'):
            return redirect('profile/')
        if hasattr(request.user, 'univer'):
            return redirect('univer/')
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
                    # tempWorkPlace.work_experience = form.cleaned_data['work_experience']
                    tempWorkPlace.min_salary = form.cleaned_data['min_salary']
                    tempWorkPlace.max_salary = form.cleaned_data['max_salary']
                    tempWorkPlace.save()

                    for temp in form.cleaned_data['employment_type']:
                        employment_type = get_object_or_404(EmploymentType, name=temp)
                        tempWorkPlace.employment_type.add(employment_type.id)

                    for temp in form.cleaned_data['profile_liked']:
                        profile_liked = get_object_or_404(EmploymentType, name=temp)
                        tempWorkPlace.employment_type.add(profile_liked.id)

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

                if education:
                    educationName = Education.objects.get(id=education).name
                else: 
                    educationName = 'Не указано'

                if profession:
                    related_professions = Profession.objects.get(id=profession).boundProfession.values_list("id",  flat=True)
                    related_professions = set(list(map(int, related_professions)))
                else:
                    related_professions = []
                users_all = []
                users_good = []
                users_wrong = []

                skillNames = []
                skillId = []   
                for el in set(list(map(int, skill))):
                    skillNames.append(Skill.objects.get(id=el).name)
                    skillId.append(Skill.objects.get(id=el).id)

                

                for user in users:
                    checkUserProf = 0
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
                            checkUserProf = 2
                    else:
                        if checkIsInclude(related_professions, user.profession.values_list("id",  flat=True)): 
                            checkUserProf = 1
                        else:
                            checkUserProf = 0
                        number_mismatches += 1
                    print( checkUserProf)

                    if set(list(map(int, skill))).issubset(user.skills.values_list("id",  flat=True)):
                        temp_dict["skill"] += 1 
                    else:
                        number_mismatches += 1

                    if not set(list(map(int, disability))).issubset(user.disability.values_list("id",  flat=True)) or list(map(int, disability)) == []:
                        temp_dict["disability"] += 1 
                    else:
                        number_mismatches += 1

                    number_mismatches_dict[number_mismatches] += 1
                    
                    skillCheck = []
                    for el in skillId:
                        if el in list(map(int, user.skills.values_list("id",  flat=True))):
                            skillCheck.append(1)
                        else:
                            skillCheck.append(0)

                    if education and (education in list(map(int, user.education.values_list("id",  flat=True))) or list(map(int, [education])) == list(map(int, user.education.values_list("id",  flat=True)))):
                        educationCheck = 1
                    else:
                        educationCheck = 0
                    
                    if checkUserProf != 0:
                        users_all.append({"name": user.name1 + ' ' + user.name2, "position": f"{user.city}, {user.location}", "profession": list(map(str, user.profession.values_list("name",  flat=True))),
                        'checkUser': checkUserProf,
                        'city': user.city.name, 'education': educationName, 'educationCheck': educationCheck, 'skill': skillNames, 'skillCheck': skillCheck, 'disability': [], 'disabilityCheck': [],
                        'desired_salary': user.desired_salary, 'user_id': user.id})
                    if checkUserProf == 1:
                        users_wrong.append({"name": user.name1 + ' ' + user.name2, "position": f"{user.city}, {user.location}", "profession": list(map(str, user.profession.values_list("name",  flat=True)))})
                    if checkUserProf == 2:
                        users_good.append({"name": user.name1 + ' ' + user.name2, "position": f"{user.city}, {user.location}", "profession": list(map(str, user.profession.values_list("name",  flat=True)))})

                user_info = {
                    "city": City.objects.get(pk= int(city)).name,
                    "target_mismatches": temp_dict,
                    "prof_desc": number_mismatches_dict,
                    "users_all": users_all,
                    "users_good": users_good,
                    "users_wrong": users_wrong
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
                id_city = request.GET.get("id_city", "")
                id_city_to_move = request.GET.getlist("id_city_to_move[]")
                education = request.GET.getlist("id_education[]")
                id_profession = request.GET.getlist("id_profession[]")
                work_experience = request.GET.getlist("id_work_experience[]")
                skill = request.GET.getlist("id_skill[]")
                sort_by = int(request.GET.get("id_sort_by"))
                if request.GET.get("check_proffession") == None:
                    check_proffession = 0 
                else:
                    check_proffession = 1
                if request.GET.get("check_city_move") == None:
                    check_city_move = 0 
                else:
                    check_city_move = 1 
                related_professions = []
                for x in id_profession:
                    for y in set(list(map(int, Profession.objects.get(id=x).boundProfession.values_list("id",  flat=True)))):
                        if y not in related_professions:
                            related_professions.append(y)
                
                profile = Profile.objects.get(user=request.user)
                work_places = WorkPlace.objects.exclude(Q(disability__in=profile.disability.values_list("id",  flat=True)) |
                Q(dysfunctions_body__in=profile.dysfunctions_body.values_list("id",  flat=True)) |
                Q(restrictions_categories_life__in=profile.restrictions_categories_life.values_list("id",  flat=True))).filter(
                (Q(city=id_city) | Q(city__in=id_city_to_move)) & (Q(profession__in=related_professions) | Q(profession__in=id_profession)))

                if check_proffession == 1 and check_city_move == 1: #реализация фильтров для инвалида
                    work_places = work_places.filter(Q(profession__in=id_profession) & Q(city=id_city))
                elif check_proffession == 1:
                    work_places = work_places.filter(profession__in=id_profession)
                elif check_city_move == 1:
                    work_places = work_places.filter(city=id_city)

                if sort_by == 1: #реализация сортировки рабочих мест
                    work_places = work_places.order_by('min_salary') #сортировка по зарплате
                elif sort_by == 2:
                    work_places = work_places.order_by('name') #сортировка по названию


                temp_dict = {"full_suc":0, "city":0, "profession":0, "city_profession":0}
                # number_mismatches_dict = [0] * 6
                # work_places_info = []
                work_place = []
                for place in work_places:
                    checkPlace = 0
                    educationCheck = 0
                    number_mismatches = 0

                    if place.city_id != int(id_city) and  place.profession.id not in list(map(int, id_profession)):
                        temp_dict["city_profession"] += 1
                        checkPlace = 4
                    elif place.city_id != int(id_city):
                        temp_dict["city"] += 1
                        checkPlace = 3
                    elif place.profession.id not in list(map(int, id_profession)):
                        temp_dict["profession"] += 1 
                        checkPlace = 2
                    else:
                        temp_dict["full_suc"] += 1
                        checkPlace = 1

                    work_place.append({"name": place.name, "profession": place.profession.name, "position": f"{place.city}, {place.location}",
                    "city": place.city.name, "address": place.location, "min_salary": place.min_salary,
                    "max_salary": place.max_salary, "id": place.id, "checkPlace": checkPlace})

                #     if not checkIsInclude(list(map(int, disability)), place.disability.values_list("id",  flat=True)) or list(map(int, disability)) == []:
                #         coincidence = 0
                #         if city and place.city_id == int(city):
                #             coincidence += 0.25
                #         if place.education.id in list(map(int, education)):
                #             coincidence += 0.25
                #         if place.profession.id in list(map(int, profession)):
                #             coincidence += 0.25
                #         if set(place.skill.values_list("id",  flat=True)).issubset(list(map(int, skill))):
                #             coincidence += 0.25
                #         work_places_info.append({"work_place_name": place.name, "work_place_profession": place.profession.name, "work_place_coincidence": coincidence, "work_place_min_salary": place.min_salary, "work_place_max_salary": place.max_salary})

                #     skillNames = list(map(str, place.skill.values_list("name",  flat=True)))
                #     skillCheck = []
                #     for el in list(map(int, place.skill.values_list("id",  flat=True))):
                #         if el in list(map(int, skill)):
                #             skillCheck.append(1)
                #         else:
                #             skillCheck.append(0)

                #     disabilityNames = list(map(str, place.disability.values_list("name",  flat=True)))
                #     disabilityCheck = []
                #     for el in list(map(int, place.disability.values_list("id",  flat=True))):
                #         if el in list(map(int, disability)):
                #             disabilityCheck.append(1)
                #         else:
                #             disabilityCheck.append(0)
            
                #     print(skillNames, skillCheck)
                #     if checkPlace != 0:
                #         work_place.append({"name": place.name, "position": f"{place.city}, {place.location}", "profession": place.profession.name, 'checkPlace': checkPlace,
                #         'city': place.city.name, 'education': place.education.name, 'educationCheck': educationCheck, 'employment_type': place.employment_type.name, 'schedule': place.schedule.name,
                #         'skill': skillNames, 'skillCheck': skillCheck, 'disability': disabilityNames, 'disabilityCheck': disabilityCheck,
                #         'min_salary': place.min_salary, "max_salary": place.max_salary, 'place_id': place.id})
                #     if checkPlace == 2:
                #         work_place_good.append({"name": place.name, "position": f"{place.city}, {place.location}", "profession": place.profession.name})
                #     if checkPlace == 1:
                #         work_place_wrong.append({"name": place.name, "position": f"{place.city}, {place.location}", "profession": place.profession.name})

                place_info = {
                    # "city": City.objects.get(pk= int(city)).name,
                    # "work_place_good": work_place_good,
                    # "work_place_wrong": work_place_wrong,
                    "target_mismatches": temp_dict,
                    # "prof_desc": number_mismatches_dict,
                    # "work_places_info": work_places_info,
                    "work_place": work_place
                }

                # print(work_places_info)
                return JsonResponse({"place_info":place_info}, status=200)

            elif request.method == 'GET':
                profile = Profile.objects.get(user=request.user)
                form = profile_form(initial={'city': profile.city, 'education': list(profile.education.values_list("id",  flat=True)), 'work_experience': list(profile.work_experience.values_list("id",  flat=True)),
                'skills': list(profile.skills.values_list("id",  flat=True)), 'profession': list(profile.profession.values_list("id",  flat=True)),
                'desired_position': list(profile.desired_position.values_list("id",  flat=True)), 'desired_skill': list(profile.desired_skill.values_list("id",  flat=True)),
                'desired_salary': profile.desired_salary})
                return render(request, 'data/personal_area_profile.html', {'form': form})

            elif request.method == 'POST':
                form = profile_form(request.POST)
                if form.is_valid():

                    user = Profile.objects.get(user=request.user)
                    
                    if (form.cleaned_data['city']!=""):  
                        user.city = form.cleaned_data['city']
                    if (form.cleaned_data['desired_salary']!=""):
                        user.desired_salary = form.cleaned_data['desired_salary']
                    if (form.cleaned_data['education']):
                        user.education.clear()
                        for temp in form.cleaned_data['education']:
                            education = get_object_or_404(Education, name=temp)
                            user.education.add(education.id)
                    if (form.cleaned_data['profession']):
                        user.profession.clear()
                        for temp in form.cleaned_data['profession']:
                            profession = get_object_or_404(Profession, name=temp)
                            user.profession.add(profession.id)
                    if (form.cleaned_data['skills']):
                        user.skills.clear()
                        for temp in form.cleaned_data['skills']:
                            skill = get_object_or_404(Skill, name=temp)
                            user.skills.add(skill.id)
                    if (form.cleaned_data['work_experience']):
                        user.work_experience.clear()
                        for temp in form.cleaned_data['work_experience']:
                            work_experience = get_object_or_404(Profession, name=temp)
                            user.work_experience.add(work_experience.id)
                    if (form.cleaned_data['desired_position']):
                        user.desired_position.clear()
                        for temp in form.cleaned_data['desired_position']:
                            desired_position = get_object_or_404(Profession, name=temp)
                            user.desired_position.add(desired_position.id)
                    if (form.cleaned_data['desired_skill']):
                        user.desired_skill.clear()
                        for temp in form.cleaned_data['desired_skill']:
                            desired_skill = get_object_or_404(Skill, name=temp)
                            user.desired_skill.add(desired_skill.id)

                    user.save()            
                    return HttpResponse("Save, sucsessfull!")


def basketFirm(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'firm'):
            workPlace = WorkPlace.objects.filter(firm=request.user.firm.id)
            work_places = []
            for el in workPlace:
                # temp1 = list(el.liked_by_profile.values_list("name1",  flat=True))
                # temp2 = list(el.liked_by_profile.values_list("name2",  flat=True))
                profile_liked_names = []
                for el1 in el.profile_liked.all():
                    profile_liked_names.append(el1.name1 + ' ' + el1.name2)
                liked_by_profile_names = []
                for el1 in el.liked_by_profile.all():
                    liked_by_profile_names.append(el1.name1 + ' ' + el1.name2)

                work_places.append({'name': el.name, "position": f"{el.city}, {el.location}", "profession": el.profession.name,
                'city': el.city.name, 'education': el.education.name, 'employment_type': el.employment_type.name, 'schedule': el.schedule.name,
                'skill': list(el.skill.values_list("name",  flat=True)),  'disability': list(el.disability.values_list("name",  flat=True)),
                'profile_liked_id': list(el.profile_liked.values_list("id",  flat=True)), 'liked_by_profile_id': list(el.liked_by_profile.values_list("id",  flat=True)), 
                'profile_liked_names': profile_liked_names, 'liked_by_profile_names': liked_by_profile_names,
                'min_salary': el.min_salary, "max_salary": el.max_salary, 'place_id': el.id})
            return render(request, 'data/basket_firm.html', {'work_places': json.dumps(work_places)})
    return HttpResponse("Как ты сюда попал?!!")


def basketProfile(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'profile'):
            profile = Profile.objects.get(user=request.user)
            workPlace = WorkPlace.objects.filter(liked_by_profile__id=profile.id)
            print(workPlace)
            work_places = []
            for el in workPlace:
                profile_liked_names = []
                for el1 in el.profile_liked.all():
                    profile_liked_names.append(el1.name1 + ' ' + el1.name2)
                liked_by_profile_names = []
                for el1 in el.liked_by_profile.all():
                    liked_by_profile_names.append(el1.name1 + ' ' + el1.name2)

                work_places.append({'name': el.name, "position": f"{el.city}, {el.location}", "profession": el.profession.name,
                'city': el.city.name, 'education': el.education.name, 'employment_type': el.employment_type.name, 'schedule': el.schedule.name,
                'skill': list(el.skill.values_list("name",  flat=True)),  'disability': list(el.disability.values_list("name",  flat=True)),
                'profile_liked_id': list(el.profile_liked.values_list("id",  flat=True)), 'liked_by_profile_id': list(el.liked_by_profile.values_list("id",  flat=True)), 
                'profile_liked_names': profile_liked_names, 'liked_by_profile_names': liked_by_profile_names,
                'min_salary': el.min_salary, "max_salary": el.max_salary, 'place_id': el.id})
            print(work_places)
            return render(request, 'data/basket_profile.html', {'work_places': json.dumps(work_places)})
    return HttpResponse("Как ты сюда попал?!!")


def usersLike(request):
    if request.method == 'GET':
        work_place = WorkPlace.objects.get(id = request.GET.get("idWorkplace"))
        profile = Profile.objects.get(user=request.user)
        place_info = 1
        print(work_place.liked_by_profile.values_list("id",  flat=True), profile)
        if profile.id in work_place.liked_by_profile.values_list("id",  flat=True):
            work_place.liked_by_profile.remove(profile)
        else:
            work_place.liked_by_profile.add(profile)
        
        return JsonResponse({"status":place_info}, status=200)


def personalAreaUniver(request):
    profiles = []
    profilesProfession = []
    info = []
    for el in Profile.objects.all():
        work_places_count = WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True)).count()
        print(WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True)))
        for work in WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True)):

            work_places = WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True))
            if el.id in list(work_places.values_list("liked_by_profile",  flat=True).values_list("id",  flat=True)):
                checkLikeByProfile = True
            else:
                checkLikeByProfile = False
            
            
            if work.id in list(work_places.values_list("profile_liked",  flat=True).values_list("id",  flat=True)):
                checkLProfileLike = True
            else:
                checkLProfileLike = False

            if checkLProfileLike and checkLikeByProfile:
                checkDoubleLike = True
            else:
                checkDoubleLike = False
            

            profilesProfession.append({'name': f'{el.name1} {el.name2} {el.name3}', 'profession': f'{work.profession.name} | Переобучение не требуется', 'work': work.name, 'checkLProfileLike': checkLProfileLike,
                'checkLikeByProfile': checkLikeByProfile, 'checkDoubleLike': checkDoubleLike, 'firm': work.firm.name, 'upPlaces': 0})



        related_professions = []
        for x in el.profession.values_list("id",  flat=True):
            for y in set(list(map(int, Profession.objects.get(id=x).boundProfession.values_list("id",  flat=True)))):
                if y not in related_professions:
                    related_professions.append(y)
        work_related_places_count = WorkPlace.objects.filter(profession__in=related_professions).count()

        for work in WorkPlace.objects.filter(profession__in=related_professions):
            work_places_related_count = WorkPlace.objects.filter(profession__in=[work.profession]).count()

            work_places = WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True))
            if el.id in list(work_places.values_list("liked_by_profile",  flat=True).values_list("id",  flat=True)):
                checkLikeByProfile = True
            else:
                checkLikeByProfile = False
            
            
            if work.id in list(work_places.values_list("profile_liked",  flat=True).values_list("id",  flat=True)):
                checkLProfileLike = True
            else:
                checkLProfileLike = False

            if checkLProfileLike and checkLikeByProfile:
                checkDoubleLike = True
            else:
                checkDoubleLike = False

            if (work_places_count == 0):
                upPlaces = 0
            else:
                upPlaces = work_places_related_count/work_places_count


            profilesProfession.append({'name': f'{el.name1} {el.name2} {el.name3}', 'profession': f'{work.profession.name}', 'work': work.name, 'checkLProfileLike': checkLProfileLike,
                'checkLikeByProfile': checkLikeByProfile, 'checkDoubleLike': checkDoubleLike, 'firm': work.firm.name, 'upPlaces': f'{upPlaces * 100}%'})
        
        #print(profilesProfession)


        # profiles = []
        if el.sex == 1:
            sex = 'Муж'
        else:
            sex = 'Жен'

        desired_professions_list = []
        for despos in el.desired_position.values_list("id",  flat=True):
            if despos in list(el.profession.values_list("id",  flat=True)):
                desired_professions_list.append(Profession.objects.get(id=despos).name)
            else:
                desired_professions_list.append(f'{Profession.objects.get(id=despos).name} | Требуется переобучение')
            # print('*', despos)


        liked_vacancies = []
        ready_to_educate = []
        user_doublelikes = []
        for work in WorkPlace.objects.filter(liked_by_profile__in=[el.id]):
            print('---', work.name)
            if work.profession.id in  el.profession.values_list("id",  flat=True):
                liked_vacancies.append(work.name)
            else:
                liked_vacancies.append(f'{work.name} | Требуется переобучение')
                ready_to_educate.append(f'{work.name} | Требуется переобучение')
            if el.id in  WorkPlace.objects.get(id=work.id).profile_liked.values_list("id",  flat=True):
                    user_doublelikes.append(f'{work.name}')


        firm_liked = []
        for work in WorkPlace.objects.filter(profile_liked__in=[el.id]):
            if work.profession.id in  el.profession.values_list("id",  flat=True):
                firm_liked.append(work.name)
            else:
                firm_liked.append(f'{work.name} | Требуется переобучение')


        # print(desired_professions_list, '*')
        profiles.append({'name': f'{el.name1} {el.name2} {el.name3}', "profession": list(el.profession.values_list("name",  flat=True)),
        'sex': sex, 'age': str(el.birth_date), 'work_experience': list(el.work_experience.values_list("name",  flat=True)), 
        'desired_position': desired_professions_list, 'liked_vacancies': liked_vacancies, 'ready_to_educate': ready_to_educate,
        'firm_liked': firm_liked, 'user_doublelikes': user_doublelikes,
        'city': el.city.name, 'education': list(el.education.values_list("name",  flat=True)),
        'skill': list(el.skills.values_list("name",  flat=True)), 'disability': list(el.disability.values_list("name",  flat=True)),
        'work_places': work_places_count, 'work_places_near': work_related_places_count,
        'id': el.id})
    # info.append({'profiles': profiles})
    # print(profiles, '***')
    work_places = []
    for el in WorkPlace.objects.all() :

        profile_liked_names = []
        worckplace_double_like = []
        for el1 in el.profile_liked.all():
            if el1.id in el.liked_by_profile.values_list("id",  flat=True):
                worckplace_double_like.append(el1.name1 + ' ' + el1.name2)
            if el.profession.id in list(el1.profession.values_list("id",  flat=True)):
                profile_liked_names.append(el1.name1 + ' ' + el1.name2)
            else:
                profile_liked_names.append(f'{el1.name1} {el1.name2} | Требуется переобучение')

        liked_by_profile_names = []
        for el1 in el.liked_by_profile.all():
            if el.profession.id in list(el1.profession.values_list("id",  flat=True)):
                liked_by_profile_names.append(el1.name1 + ' ' + el1.name2)
            else:
                liked_by_profile_names.append(f'{el1.name1} {el1.name2} | Требуется переобучение')

        work_places.append({'name': el.name, 'firm': el.firm.name , "position": f"{el.city}, {el.location}", "profession": el.profession.name,
        'city': el.city.name, 'education': el.education.name, 'employment_type': el.employment_type.name, 'schedule': el.schedule.name,
        'skill': list(el.skill.values_list("name",  flat=True)),  'disability': list(el.disability.values_list("name",  flat=True)),
        'profile_liked_id': list(el.profile_liked.values_list("id",  flat=True)), 'liked_by_profile_id': list(el.liked_by_profile.values_list("id",  flat=True)), 
        'profile_liked_names': profile_liked_names, 'liked_by_profile_names': liked_by_profile_names, 'worckplace_double_like': worckplace_double_like, 'place_count': 10,
        'min_salary': el.min_salary, "max_salary": el.max_salary, 'place_id': el.id})
    # print(work_places)

    courses = []
    for course in Course.objects.all():      
        courses.append({'name': course.name, 'skill': course.name, 'univer': Univer.objects.get(course=course).name, 'count': course.count,
            'price_per_person': course.price, 'price':course.price*course.count ,'forecast': 20})

    return render(request, 'data/personal_area_univer.html', {'tabl2': json.dumps(profiles), 'work_places': json.dumps(work_places),
        'tabl1': json.dumps(profilesProfession), 'courses': json.dumps(courses)})
    # return HttpResponse("Как ты сюда попал?!!")


def personalInfoProfile(request):
    if request.method == 'POST':
        form = personal_info_profile(request.POST)

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
            if (form.cleaned_data['disability_group']!=""):
                user.disability_group = form.cleaned_data['disability_group']
            if (form.cleaned_data['desired_salary']!=""):
                user.desired_salary = form.cleaned_data['desired_salary']
            user.save()
            if (form.cleaned_data['education']):
                user.education.clear()
                for temp in form.cleaned_data['education']:
                    education = get_object_or_404(Education, name=temp)
                    user.education.add(education.id)
            if (form.cleaned_data['profession']):
                user.profession.clear()
                for temp in form.cleaned_data['profession']:
                    profession = get_object_or_404(Profession, name=temp)
                    user.profession.add(profession.id)
            if (form.cleaned_data['skills']):
                user.skills.clear()
                for temp in form.cleaned_data['skills']:
                    skill = get_object_or_404(Skill, name=temp)
                    user.skills.add(skill.id)
            if (form.cleaned_data['disability']):
                user.disability.clear()
                for temp in form.cleaned_data['disability']:
                    disability = get_object_or_404(Disability, name=temp)
                    user.disability.add(disability.id)
            if (form.cleaned_data['work_experience']):
                user.work_experience.clear()
                for temp in form.cleaned_data['work_experience']:
                    work_experience = get_object_or_404(Profession, name=temp)
                    user.work_experience.add(work_experience.id)
            if (form.cleaned_data['dysfunctions_body']):
                user.dysfunctions_body.clear()
                for temp in form.cleaned_data['dysfunctions_body']:
                    dysfunctions_body = get_object_or_404(DysfunctionsBody, name=temp)
                    user.dysfunctions_body.add(dysfunctions_body.id)
            if (form.cleaned_data['restrictions_categories_life']):
                user.restrictions_categories_life.clear()
                for temp in form.cleaned_data['restrictions_categories_life']:
                    restrictions_categories_life = get_object_or_404(RestrictionsCategoriesLife, name=temp)
                    user.restrictions_categories_life.add(restrictions_categories_life.id)
            if (form.cleaned_data['desired_position']):
                user.desired_position.clear()
                for temp in form.cleaned_data['desired_position']:
                    desired_position = get_object_or_404(Profession, name=temp)
                    user.desired_position.add(desired_position.id)
            if (form.cleaned_data['desired_skill']):
                user.desired_skill.clear()
                for temp in form.cleaned_data['desired_skill']:
                    desired_skill = get_object_or_404(Skill, name=temp)
                    user.desired_skill.add(desired_skill.id)

            user.save()
            # return render(request, 'data/personal_info_profile.html', {'form': form})
    else:
        profile = Profile.objects.get(user=request.user)
        form = personal_info_profile(initial={'description': profile.description, 'sex': profile.sex, 'birth_date': profile.birth_date, 
        'city': profile.city, 'location': profile.location, 'education': list(profile.education.values_list("id",  flat=True)), 'work_experience': list(profile.work_experience.values_list("id",  flat=True)), 'dysfunctions_body': list(profile.dysfunctions_body.values_list("id",  flat=True)),
        'restrictions_categories_life': list(profile.restrictions_categories_life.values_list("id",  flat=True)), 'disability': list(profile.disability.values_list("id",  flat=True)), 'skills': list(profile.skills.values_list("id",  flat=True)), 'profession': list(profile.profession.values_list("id",  flat=True)),
        'desired_position': list(profile.desired_position.values_list("id",  flat=True)), 'desired_skill': list(profile.desired_skill.values_list("id",  flat=True)),
        'disability_group': profile.disability_group, 'name1': profile.name1, 'name2': profile.name2, 'name3': profile.name3, 'desired_salary': profile.desired_salary})

    return render(request, 'data/personal_info_profile.html', {'form': form})


def registrationUniver(request):
    if request.method == 'POST':
        form = registration_univer_form(request.POST)
        if form.is_valid():  
            tempUser = User(username=form.cleaned_data['username'], email=form.cleaned_data['email'], password = form.cleaned_data['password'])
            tempUser.save()
            tempUser.set_password(tempUser.password)
            tempUser.save()

            tempUniver = Univer(user=tempUser, name=form.cleaned_data['name'])
            tempUniver.save()
            return redirect('/accounts/login/')

    else:
        form = registration_univer_form
    return render(request, 'data/registration_univer.html', {'form': form})
    

def addCourseByUniver(request):
    if request.method == 'POST':
        form = add_course_by_univer_form(request.POST)
        if form.is_valid():
            tempCourse = Course(name=form.cleaned_data['name'], description=form.cleaned_data['description'], count=form.cleaned_data['count'], price=form.cleaned_data['price'])
            tempCourse.save()
            tempUniver = Univer.objects.get(id=request.user.univer.id)
            tempUniver.course.add(tempCourse.id)
            tempUniver.save()
            print('******************************', tempUniver)
            return redirect('/personal_area/univer/')
    else:
        form = add_course_by_univer_form
    return render(request, 'data/univer_course.html', {'form': form})
