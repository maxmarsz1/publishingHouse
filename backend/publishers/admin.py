from django.contrib import admin
from .models import Publisher, PublisherMembership

admin.site.register(Publisher)
admin.site.register(PublisherMembership)