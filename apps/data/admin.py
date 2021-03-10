from django.contrib import admin

from .models import Firm, Disability, Education, Profession, City, Skill, Profile

# admin.site.register(User)
admin.site.register(Firm)
admin.site.register(Disability)
admin.site.register(Education)
admin.site.register(Profession)
admin.site.register(City)
admin.site.register(Skill)
admin.site.register(Profile)

