from . import views
from django.urls import path, include

urlpatterns = [
    path('', views.index, name = 'index'),
    path('sr/', views.sr),
    # path('registration_profile/', views.registration_profile, name='registration_profile'),
    path('registration_profile/', views.registrationProfile, name='registration_profile'),
    path('registration/', views.registration, name='registration'),
    path('get_user_info/', views.getUserInfo, name = 'get_user_info'),
    path('test_page/', views.testPage, name = 'test_page'),
    path('test_page/test_update/', views.testUpdate, name = 'test_update'),
    path('registration_firm/', views.registrationFirm, name = 'registration_firm'),
    path('registration_univer/', views.registrationUniver, name = 'registration_univer'),
    path('personal_area/', views.personalArea, name='personal_area'),
    path('personal_area/firm/', views.personalAreaFirm, name='personal_area_firm'),
    path('personal_area/profile/', views.personalAreaProfile, name='personal_area_profile'),
    path('personal_area/profile/show_info', views.personalAreaProfileShowInfo, name='personal_area_profile_show_info'),
    path('personal_area/firm/basket/', views.basketFirm, name='basket_firm'),
    path('personal_area/profile/basket/', views.basketProfile, name='basket_profile'),
    path('personal_area/profile/basket/show_info', views.personalAreaProfileBasketShowInfo, name='personal_area_profile_basket_show_info'),
    path('personal_area/profile/like', views.usersLike, name='users_like'),
    path('personal_area/univer/', views.personalAreaUniver, name='personal_area_univer'),
    path('personal_area/univer/basket', views.basketUniver, name='basket_univer'),
    path('personal_area/univer/add_course', views.addCourseByUniver, name='add_course_by_univer'),
    path('personal_area/univer/delete_course', views.deleteCourseByUniver, name='delete_course_by_univer'),
    path('personal_area/profile/info', views.personalInfoProfile, name='personal_info_profile'),
    
    path('personal_area/profile/notification', views.notificationProfile, name='notification_profile'),
    path('personal_area/profile/notification/confirmation', views.notificationProfileConfirmation, name='notification_profile_confirmation'),
    path('personal_area/firm/show_info', views.personalAreaFirmShowInfo, name='personal_area_firm_show_info'),
    path('delete/workplace', views.deleteWorkPlace, name='delete_workplace')
]

urlpatterns += [
    path('accounts/', include('django.contrib.auth.urls')),
]