from django.contrib import admin

from .models import Firm, Disability, Education, Profession, City, Skill, Profile, Schedule, WorkPlace, EmploymentType, Profile
from .models import DisabilityGroups, RestrictionsCategoriesLife, DysfunctionsBody
admin.site.register(Profile)
admin.site.register(Firm)
admin.site.register(Disability)
admin.site.register(Education)
admin.site.register(Profession)
admin.site.register(City)
admin.site.register(Skill)
admin.site.register(Schedule)
admin.site.register(WorkPlace)
admin.site.register(EmploymentType)
admin.site.register(DisabilityGroups)
admin.site.register(RestrictionsCategoriesLife)
admin.site.register(DysfunctionsBody)