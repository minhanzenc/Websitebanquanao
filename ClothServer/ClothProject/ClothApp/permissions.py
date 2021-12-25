from django.contrib.auth.models import AnonymousUser
from rest_framework import permissions

class KhachHangPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
           return True
        else:
            return request.user == obj


class DonHangPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == 'POST':
            return request.user != AnonymousUser
        else:
            return request.user == obj.khach_hang

