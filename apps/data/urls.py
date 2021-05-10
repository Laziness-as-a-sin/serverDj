from . import views
from django.urls import path, include

urlpatterns = [
    path('', views.index, name = 'index'),
    path('sr/', views.sr),
    # path('registration_profile/', views.registration_profile, name='registration_profile'),
    path('registration_profile/', views.registrationProfile, name='registration_profile'),
    path('get_user_info/', views.getUserInfo, name = 'get_user_info'),
    path('test_page/', views.testPage, name = 'test_page'),
    path('test_page/test_update/', views.testUpdate, name = 'test_update'),
    path('registration_firm/', views.registrationFirm, name = 'registration_firm'),
    path('personal_area/', views.personalArea, name='personal_area'),
    path('personal_area/firm/', views.personalAreaFirm, name='personal_area_firm'),
    path('personal_area/profile/', views.personalAreaProfile, name='personal_area_profile'),
    path('personal_area/firm/basket/', views.basketFirm, name='basket_firm'),
    path('personal_area/profile/basket/', views.basketProfile, name='basket_profile'),
    path('personal_area/profile/like', views.usersLike, name='users_like'),
    path('personal_area/univer/', views.personalAreaUniver, name='personal_area_univer')
]

urlpatterns += [
    path('accounts/', include('django.contrib.auth.urls')),
]