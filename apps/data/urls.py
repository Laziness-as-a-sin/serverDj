from . import views
from django.urls import path, include

urlpatterns = [
    path('', views.index, name = 'index'),
    path('sr/', views.sr),
    path('registration_profile/', views.registration_profile, name='registration_profile'),
    path('registration_profile_form/', views.registration_profile_form, name='registration_profile_form'),
    path('get_user_info/', views.getUserInfo, name = 'get_user_info'),
    path('test_page/', views.testPage, name = 'test_page'),
    path('test_page/test_update/', views.testUpdate, name = 'test_update'),
]

urlpatterns += [
    path('accounts/', include('django.contrib.auth.urls')),
]