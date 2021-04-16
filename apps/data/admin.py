from django.contrib import admin

from .models import Firm, Disability, Education, Profession, City, Skill, Profile, Schedule, WorkPlace, WorkExperience, EmploymentType, Profile
admin.site.register(Profile)
admin.site.register(Firm)
admin.site.register(Disability)
admin.site.register(Education)
admin.site.register(Profession)
admin.site.register(City)
admin.site.register(Skill)
admin.site.register(Schedule)
admin.site.register(WorkPlace)
admin.site.register(WorkExperience)
admin.site.register(EmploymentType)
