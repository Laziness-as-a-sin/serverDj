from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template.context_processors import csrf
from .models import City, Profile, Profession, Disability, Firm, WorkPlace, EmploymentType, Schedule, Skill, Education, DysfunctionsBody
from .models import RestrictionsCategoriesLife, Univer, Course
from django.contrib.auth.models import User
from .forms import index_form, workPlace_form, registration_firm_form, registration_profile_form, profile_form, personal_info_profile, registration_univer_form, add_course_by_univer_form
from django.http import JsonResponse
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
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


def registration(request):
    return render(request, 'data/registration.html')

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
                    tempWorkPlace.location = form.cleaned_data['location']
                    tempWorkPlace.education = form.cleaned_data['education']
                    tempWorkPlace.profession = form.cleaned_data['profession']
                    tempWorkPlace.min_salary = form.cleaned_data['min_salary']
                    tempWorkPlace.max_salary = form.cleaned_data['max_salary']
                    tempWorkPlace.count = form.cleaned_data['count']
                    tempWorkPlace.save()

                    for temp in form.cleaned_data['employment_type']:
                        employment_type = get_object_or_404(EmploymentType, name=temp)
                        tempWorkPlace.employment_type.add(employment_type.id)

                    for temp in form.cleaned_data['profile_liked']:
                        userTemp = User.objects.get(username = temp)
                        profile_liked = get_object_or_404(Profile, user=userTemp)
                        tempWorkPlace.profile_liked.add(profile_liked.id)

                    for temp in form.cleaned_data['schedule']:
                        schedule = get_object_or_404(Schedule, name=temp)
                        tempWorkPlace.schedule.add(schedule.id)

                    for temp in form.cleaned_data['skill']:
                        skill = get_object_or_404(Skill, name=temp)
                        tempWorkPlace.skill.add(skill.id)

                    for temp in form.cleaned_data['disability']:
                        disability = get_object_or_404(Disability, name=temp)
                        tempWorkPlace.disability.add(disability.id)

                    for temp in form.cleaned_data['dysfunctions_body']:
                        dysfunctions_body = get_object_or_404(DysfunctionsBody, name=temp)
                        tempWorkPlace.dysfunctions_body.add(dysfunctions_body.id)

                    for temp in form.cleaned_data['restrictions_categories_life']:
                        restrictions_categories_life = get_object_or_404(RestrictionsCategoriesLife, name=temp)
                        tempWorkPlace.restrictions_categories_life.add(restrictions_categories_life.id)

                    tempWorkPlace.save()
                    
                    return redirect('/personal_area/firm/basket/')
            

            if request.method == "GET" and request.is_ajax():
                id_city = request.GET.get("id_city", "")
                id_education = request.GET.get("id_education")
                id_profession = request.GET.get("id_profession")
                id_skill = request.GET.getlist("id_skill[]")
                id_disability = list(map(int, request.GET.getlist("id_disability[]")))
                id_dysfunctions_body = list(map(int, request.GET.getlist("id_dysfunctions_body[]")))
                id_restrictions_categories_life= list(map(int, request.GET.getlist("id_restrictions_categories_life[]")))
                if request.GET.get("check_proffession") == None:
                    check_proffession = 0 
                else:
                    check_proffession = 1
                if request.GET.get("check_city_move") == None:
                    check_city_move = 0 
                else:
                    check_city_move = 1 
                if request.GET.get("check_disability") == None:
                    check_disability = 0 
                else:
                    check_disability = 1 
                related_professions = []
                for x in id_profession:
                    for y in set(list(map(int, Profession.objects.get(id=x).boundProfession.values_list("id",  flat=True)))):
                        if y not in related_professions:
                            related_professions.append(y)
                
                profiles = Profile.objects.filter((Q(city=id_city) | Q(city_to_move__in=[id_city])) & (Q(profession__in=related_professions) | Q(profession__in=[id_profession]))).distinct()
                if check_proffession == 1 and check_city_move == 1: #реализация фильтров для инвалида
                    profiles = profiles.filter(Q(profession__in=[id_profession]) & Q(city=id_city))
                elif check_proffession == 1:
                    profiles = profiles.filter(profession__in=[id_profession])
                elif check_city_move == 1:
                    profiles = profiles.filter(city=id_city)

                if check_disability == 1:
                    profiles = profiles.exclude(Q(disability__in=id_disability) |
                    Q(dysfunctions_body__in=id_dysfunctions_body) |
                    Q(restrictions_categories_life__in=id_restrictions_categories_life))

                temp_dict = {"full_suc":0, "city":0, "profession":0, "city_profession":0, "disability": 0}
                work_place = []
                for profile in profiles:
                    checkPlace = 1
                    if checkIsInclude(list(map(int, profile.disability.values_list("id",  flat=True))), id_disability) or checkIsInclude(list(map(int, (profile.dysfunctions_body.values_list("id",  flat=True)))), id_dysfunctions_body) or checkIsInclude(list(map(int, (profile.restrictions_categories_life.values_list("id",  flat=True)))), id_restrictions_categories_life):
                        temp_dict["disability"] += 1
                        checkPlace = 5
                    elif profile.city_id != int(id_city) and int(id_profession) not in list(map(int, profile.profession.values_list("id",  flat=True))):
                        temp_dict["city_profession"] += 1
                        checkPlace = 4
                    elif profile.city_id != int(id_city):
                        temp_dict["city"] += 1
                        checkPlace = 3
                    elif int(id_profession) not in list(map(int, profile.profession.values_list("id",  flat=True))):
                        temp_dict["profession"] += 1 
                        checkPlace = 2
                    else:
                        temp_dict["full_suc"] += 1
                        checkPlace = 1                   

                    work_place.append({"name": f'Соискатель {profile.id}', "position": f"{profile.city.name}, {profile.location}",
                    "city": profile.city.name, "address": profile.location, "id": profile.id, "checkPlace": checkPlace})

                place_info = {
                    "target_mismatches": temp_dict,
                    "work_place": work_place,
                    "city": City.objects.get(id=id_city).name
                }
                print('III')
                return JsonResponse({"place_info":place_info}, status=200)
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
                (Q(city=id_city) | Q(city__in=id_city_to_move)) & (Q(profession__in=related_professions) | Q(profession__in=id_profession))).distinct()

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
                print(work_places)
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

                place_info = {
                    "target_mismatches": temp_dict,
                    "work_place": work_place,
                    "city": City.objects.get(id=id_city).name
                }

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
                    profile_liked_names.append(f'Соискатель {el1.id}')
                liked_by_profile_names = []
                mutual_liked_names = []
                for el1 in el.liked_by_profile.all():
                    liked_by_profile_names.append(f'Соискатель {el1.id}')
                    for el2 in el.profile_liked.all(): 
                        if el2 == el1:
                            mutual_liked_names.append(f'Соискатель {el1.id}')

                work_places.append({'name': el.name, "position": f"{el.city}, {el.location}", "profession": el.profession.name,
                'city': el.city.name, 'education': el.education.name, 'employment_type': list(el.employment_type.values_list("name",  flat=True)), 'schedule': list(el.schedule.values_list("name",  flat=True)),
                'skill': list(el.skill.values_list("name",  flat=True)),  'disability': list(el.disability.values_list("name",  flat=True)),
                'profile_liked_id': list(el.profile_liked.values_list("id",  flat=True)), 'liked_by_profile_id': list(el.liked_by_profile.values_list("id",  flat=True)), 
                'profile_liked_names': profile_liked_names, 'liked_by_profile_names': liked_by_profile_names, 'mutual_liked_names': mutual_liked_names,
                'min_salary': el.min_salary, "max_salary": el.max_salary, 'place_id': el.id})
            return render(request, 'data/basket_firm.html', {'work_places': json.dumps(work_places)})
    return HttpResponse("Как ты сюда попал?!!")


def basketProfile(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'profile'):
            profile = Profile.objects.get(user=request.user)
            work_places = []

            workPlace = WorkPlace.objects.filter(Q(liked_by_profile__id=profile.id) & Q(profile_liked__id=profile.id))            
            for place in workPlace:
                work_places.append({'name': place.name, "position": f"{place.city}, {place.location}", "profession": place.profession.name, "min_salary": place.min_salary,
                    "max_salary": place.max_salary, "id": place.id, "checkPlace": 1, 
                    'place_id': place.id})

            workPlace = WorkPlace.objects.filter(liked_by_profile__id=profile.id)            
            for place in workPlace:
                work_places.append({'name': place.name, "position": f"{place.city}, {place.location}", "profession": place.profession.name, "min_salary": place.min_salary,
                    "max_salary": place.max_salary, "id": place.id, "checkPlace": 2, 
                    'place_id': place.id})
            
            workPlace = WorkPlace.objects.exclude(liked_by_profile__id=profile.id)           
            for place in workPlace:
                work_places.append({'name': place.name, "position": f"{place.city}, {place.location}", "profession": place.profession.name, "min_salary": place.min_salary,
                    "max_salary": place.max_salary, "id": place.id, "checkPlace": 3, 
                    'place_id': place.id})

            profilesProfession = []
            for work in WorkPlace.objects.filter(profession__in=profile.profession.values_list("id",  flat=True)):
            # work_places = WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True))
                if profile.id in list(work.liked_by_profile.values_list("id",  flat=True)):
                    checkLikeByProfile = True
                else:
                    checkLikeByProfile = False
            
            if profile.id in list(work.profile_liked.values_list("id",  flat=True)):
                checkLProfileLike = True
            else:
                checkLProfileLike = False

            if checkLProfileLike and checkLikeByProfile:
                checkDoubleLike = True
            else:
                checkDoubleLike = False
            

            profilesProfession.append({'profession': f'{work.profession.name} | Переобучение не требуется', 'work': work.name, 'checkLProfileLike': checkLProfileLike,
                'checkLikeByProfile': checkLikeByProfile, 'checkDoubleLike': checkDoubleLike, 'firm': work.firm.name, 'upPlaces': 0})



            related_professions = []
            for x in profile.profession.values_list("id",  flat=True):
                for y in set(list(map(int, Profession.objects.get(id=x).boundProfession.values_list("id",  flat=True)))):
                    if y not in related_professions:
                        related_professions.append(y)
        
            work_related_places_count = WorkPlace.objects.filter(profession__in=related_professions).count()
            for work in WorkPlace.objects.filter(profession__in=related_professions).exclude(profession__in=profile.profession.values_list("id",  flat=True)):
                work_places_related_count = WorkPlace.objects.filter(profession__in=[work.profession]).count()

                work_places = WorkPlace.objects.filter(profession__in=profile.profession.values_list("id",  flat=True))
                if profile.id in list(work_places.values_list("liked_by_profile",  flat=True).values_list("id",  flat=True)):
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

                # if (work_places_count == 0):
                #     upPlaces = 0
                # else:
                #     upPlaces = work_places_related_count/work_places_count


                profilesProfession.append({'profession': f'{work.profession.name} | Требуется переобучение', 'work': work.name, 'checkLProfileLike': checkLProfileLike,
                    'checkLikeByProfile': checkLikeByProfile, 'checkDoubleLike': checkDoubleLike, 'firm': work.firm.name, 'upPlaces': work_places_related_count})
            print(profilesProfession)
            return render(request, 'data/basket_profile.html', {'work_places': json.dumps(work_places), 'tabl1': json.dumps(profilesProfession)})
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
        print('WorkPlace', WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True)))
        for work in WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True)):

            # work_places = WorkPlace.objects.filter(profession__in=el.profession.values_list("id",  flat=True))
            if el.id in list(work.liked_by_profile.values_list("id",  flat=True)):
                checkLikeByProfile = True
            else:
                checkLikeByProfile = False
            
            print('ID: ', el.id, 'work_places: ', list(work.profile_liked.values_list("id",  flat=True)))
            if el.id in list(work.profile_liked.values_list("id",  flat=True)):
                print('AAAA')
                checkLProfileLike = True
            else:
                checkLProfileLike = False

            if checkLProfileLike and checkLikeByProfile:
                print('BBBB')
                checkDoubleLike = True
            else:
                checkDoubleLike = False
            

            profilesProfession.append({'name': f'{el.name1} {el.name2} {el.name3}', 'profession': f'{work.profession.name} | Переобучение не требуется', 'work': work.name, 'checkLProfileLike': checkLProfileLike,
                'checkLikeByProfile': checkLikeByProfile, 'checkDoubleLike': checkDoubleLike, 'firm': work.firm.name, 'upPlaces': 1})



        related_professions = []
        for x in el.profession.values_list("id",  flat=True):
            for y in set(list(map(int, Profession.objects.get(id=x).boundProfession.values_list("id",  flat=True)))):
                if y not in related_professions:
                    related_professions.append(y)
        work_related_places_count = WorkPlace.objects.filter(profession__in=related_professions).count()

        print('related_professions: ', related_professions, WorkPlace.objects.filter(profession__in=related_professions))
        for work in WorkPlace.objects.filter(profession__in=related_professions).exclude(profession__in=el.profession.values_list("id",  flat=True)):
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

            # if (work_places_count == 0):
            #     upPlaces = 0
            # else:
            #     upPlaces = work_places_related_count/work_places_count


            profilesProfession.append({'name': f'{el.name1} {el.name2} {el.name3}', 'profession': f'{work.profession.name} | Требуется переобучение', 'work': work.name, 'checkLProfileLike': checkLProfileLike,
                'checkLikeByProfile': checkLikeByProfile, 'checkDoubleLike': checkDoubleLike, 'firm': work.firm.name, 'upPlaces': work_places_related_count})
        
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
        'profile_liked_names': profile_liked_names, 'liked_by_profile_names': liked_by_profile_names, 'worckplace_double_like': worckplace_double_like, 'place_count': el.count,
        'min_salary': el.min_salary, "max_salary": el.max_salary, 'place_id': el.id})
    # print(work_places)

    courses = []
    
    for course in Course.objects.all():
        # print(list(course.confirmed_profile.values_list('id', flat=True)))
        courses.append({'name': course.name, 'skill': course.profession.name, 'univer': Univer.objects.get(course=course).name, 'count': course.count,
            'price_per_person': course.price, 'price':course.price*course.count ,'forecast': course.count, 'profiles': course.confirmed_profile.count()})

    print('****************', courses)
    recomm_courses = []
    dict_work_count = {}
    for work in WorkPlace.objects.all():
        if work.profession.name in dict_work_count.keys():
            if work.count:
                dict_work_count[work.profession.name] += work.count
        else:
            if work.count:
                dict_work_count[work.profession.name] = work.count

    for key, value in dict_work_count.items():
        unique_users = []
        for el in WorkPlace.objects.filter(profession__name=key):

            for x in list(set(el.liked_by_profile.values_list('id', flat=True)) & set(el.profile_liked.values_list('id', flat=True))):
                if x not in unique_users:
                    unique_users.append(x)

        recomm_courses.append({'name': key, 'count_work_place': value, 'profession': key, 'recomm_count': value, 'forecast': min(len(unique_users), value)})
    print(recomm_courses)
    
    form = add_course_by_univer_form
    return render(request, 'data/personal_area_univer.html', {'tabl2': json.dumps(profiles), 'work_places': json.dumps(work_places),
        'tabl1': json.dumps(profilesProfession), 'courses': json.dumps(courses), 'recomm_courses':json.dumps(recomm_courses), 'form': form})
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
    
@csrf_exempt
def addCourseByUniver(request):
    if request.method == 'GET':  
        cookies = request.COOKIES
        print(cookies)
        
        form = add_course_by_univer_form(initial={'name':cookies['name'], 'count':cookies['recomm_count'], 'profession': Profession.objects.get(name=cookies['profession'])})
        return render(request, 'data/univer_course.html', {'form': form})
    if request.method == 'POST':
        form = add_course_by_univer_form(request.POST)
        if form.is_valid():
            unique_users = []
            for x in list(WorkPlace.objects.filter(profession__name=form.cleaned_data['name']).values_list('liked_by_profile',flat=True)):
                if x not in unique_users:
                    unique_users.append(x)

            tempCourse = Course(name=form.cleaned_data['name'], profession=form.cleaned_data['profession'],  description=form.cleaned_data['description'], 
                count=form.cleaned_data['count'], price=form.cleaned_data['price'])
            tempCourse.save()
            for prof in Profile.objects.filter(id__in=unique_users):
                tempCourse.profiles.add(prof.id)

            tempCourse.save()
            tempUniver = Univer.objects.get(id=request.user.univer.id)
            tempUniver.course.add(tempCourse.id)
            tempUniver.save()
            print('******************************', tempUniver)
    return redirect('/personal_area/univer/')


def personalAreaProfileShowInfo(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'profile'):
            if request.method == "GET" and request.is_ajax():
                id_city = request.GET.get("id_city", "")
                id_education = request.GET.getlist("id_education[]")
                id_profession = request.GET.getlist("id_profession[]")
                id_skill = request.GET.getlist("id_skill[]")
                profile = Profile.objects.get(user=request.user)
                work_place = WorkPlace.objects.get(id=request.GET.get("id"))
                
                if profile.city.id == int(id_city):
                    city = f'{work_place.city.name} <font class="text-success">✓</font>'
                else:
                    city = f'{work_place.city.name} <font class="text-danger">✗</font>'

                if work_place.education.id in set(list(map(int, id_education))):
                    education = f'{work_place.education.name} <font class="text-success">✓</font>'
                else:
                    education = f'{work_place.education.name} <font class="text-danger">✗</font>'

                if work_place.profession.id in set(list(map(int, id_profession))):
                    profession = f'{work_place.profession.name} <font class="text-success">✓</font>'
                else:
                    profession = f'{work_place.profession.name} <font class="text-danger">✗</font>'

                skills = []
                for id in work_place.skill.values_list("id",  flat=True):
                    if id in set(list(map(int, id_skill))):
                        skills.append(f'{Skill.objects.get(id=id).name} <font class="text-success">✓</font>')
                    else:
                        skills.append(f'{Skill.objects.get(id=id).name} <font class="text-danger">✗</font>')

                work_place_info = {"Наименование": [work_place.name], "Фирма": [work_place.firm.name], 
                "Город": [city], "Адрес": [work_place.location], "Образование": [education], "Профессия": [profession],
                "Тип занятости": [work_place.employment_type.name], "График работы": [work_place.schedule.name],
                "Образование": [education], "Компетенции": skills, "Зарплата": [f'{work_place.min_salary} – {work_place.max_salary}']}

                return JsonResponse({"place_info":work_place_info}, status=200)
    else:
        return HttpResponse("Как ты сюда попал?!!")


def notificationProfile(request):
    # print(request.user.profile.id)
    print(Course.objects.filter(profiles__id=request.user.profile.id).values_list('name', flat=True))
    courses_recomm = []
    for course in Course.objects.filter(profiles__id=request.user.profile.id):
        courses_recomm.append({'name': course.name, 'price': course.price, 'profession': course.profession.name,
            'univer': list(Univer.objects.filter(course=course.id).values_list('name', flat=True)), 'count': course.count})
    print(courses_recomm)

    courses_confirmed = []
    for course in Course.objects.filter(confirmed_profile__id=request.user.profile.id):
        courses_confirmed.append({'name': course.name, 'price': course.price, 'profession': course.profession.name,
            'univer': list(Univer.objects.filter(course=course.id).values_list('name', flat=True)), 'count': course.count})

    return render(request, 'data/notification_profile.html', {'courses_recomm':json.dumps(courses_recomm), 'courses_confirmed':json.dumps(courses_confirmed)})


def notificationProfileConfirmation(request):
    if request.method == "GET" and request.is_ajax():
        course = Course.objects.get(name=request.GET.get("name"), profession=Profession.objects.get(name=request.GET.get("profession")))
        course.confirmed_profile.add(request.user.profile.id)
        course.profiles.remove(request.user.profile.id)
        course.save()
        return JsonResponse({'kek':'kek'}, status=200)


def personalAreaFirmShowInfo(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'firm'):
            if request.method == "GET" and request.is_ajax():
                id = int(request.GET.get("id"))
                id_city = request.GET.get("id_city", "")
                id_education = request.GET.get("id_education")
                id_profession = request.GET.get("id_profession")
                id_skill = request.GET.getlist("id_skill[]")
                id_disability = request.GET.getlist("id_disability[]") 
                id_dysfunctions_body = request.GET.getlist("id_dysfunctions_body[]")
                id_restrictions_categories_life= request.GET.getlist("id_restrictions_categories_life[]")
                profile = Profile.objects.get(id=id)

                if profile.city.id == int(id_city):
                    city = f'{profile.city.name} <font class="text-success">✓</font>'
                else:
                    city = f'{profile.city.name} <font class="text-danger">✗</font>'

                education = []
                for el in profile.education.all():
                    if el.id == id_education:
                        education.append(f'{el.name} <font class="text-success">✓</font>')
                    else:
                        education.append(f'{el.name} <font class="text-danger">✗</font>')

                profession = []
                for el in profile.profession.all():
                    print('id_profession', el.id, int(id_profession))
                    if el.id == int(id_profession):
                        profession.append(f'{el.name} <font class="text-success">✓</font>')
                    else:
                        profession.append(f'{el.name} <font class="text-danger">✗</font>')

                skill = []
                for el in profile.skills.all():
                    if el.id in id_skill:
                        skill.append(f'{el.name} <font class="text-success">✓</font>')
                    else:
                        skill.append(f'{el.name} <font class="text-danger">✗</font>')

                work_place_info = {"Наименование": [f'Соискатель {profile.id}'],
                "Город": [city], "Адрес": [profile.location], "Образование": education, "Профессия": profession,
                "Образование": education, "Компетенции": skill}
                print(work_place_info)
                return JsonResponse({"place_info":work_place_info}, status=200)
    else:
        return HttpResponse("Как ты сюда попал?!!")


def personalAreaProfileBasketShowInfo(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'profile'):
            if request.method == "GET" and request.is_ajax():
                profile = Profile.objects.get(user=request.user)
                work_place = WorkPlace.objects.get(id=request.GET.get("id"))
                id_city = profile.city.id
                id_education = profile.education.values_list("id",  flat=True)
                id_profession = profile.profession.values_list("id",  flat=True)
                id_skill = profile.skills.values_list("id",  flat=True)

                if profile.city.id == int(id_city):
                    city = f'{work_place.city.name} <font class="text-success">✓</font>'
                else:
                    city = f'{work_place.city.name} <font class="text-danger">✗</font>'

                if work_place.education.id in set(list(map(int, id_education))):
                    education = f'{work_place.education.name} <font class="text-success">✓</font>'
                else:
                    education = f'{work_place.education.name} <font class="text-danger">✗</font>'

                if work_place.profession.id in set(list(map(int, id_profession))):
                    profession = f'{work_place.profession.name} <font class="text-success">✓</font>'
                else:
                    profession = f'{work_place.profession.name} <font class="text-danger">✗</font>'

                skills = []
                for id in work_place.skill.values_list("id",  flat=True):
                    if id in set(list(map(int, id_skill))):
                        skills.append(f'{Skill.objects.get(id=id).name} <font class="text-success">✓</font>')
                    else:
                        skills.append(f'{Skill.objects.get(id=id).name} <font class="text-danger">✗</font>')

                work_place_info = {"Наименование": [work_place.name], "Фирма": [work_place.firm.name], 
                "Город": [city], "Адрес": [work_place.location], "Образование": [education], "Профессия": [profession],
                "Тип занятости": [work_place.employment_type.name], "График работы": [work_place.schedule.name],
                "Образование": [education], "Компетенции": skills, "Люди поставили лайк": [work_place.liked_by_profile.count()],
                "Людей лайкнули": [work_place.profile_liked.count()], "Зарплата": [f'{work_place.min_salary} – {work_place.max_salary}']}

                return JsonResponse({"place_info":work_place_info}, status=200)
    else:
        return HttpResponse("Как ты сюда попал?!!")

