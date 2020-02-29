from rest_framework import permissions
from accounts.models import Group

class IsTheSameUser(permissions.BasePermission):
    """
        verify if the user whose sending the request
        to update his profile information is updating his
        own information not another user info
    """

    def has_object_permission(self, request, view, obj):

        # Instance must have an attribute named `owner`.
        return obj == request.user

class IsMember(permissions.BasePermission):
    """
        verify if the user whose sending the request
        is a member of a given group
    """

    def has_object_permission(self, request, view, obj):
        user = request.user
        # obj == group.
        return user in obj.members.all() or obj.creator == user