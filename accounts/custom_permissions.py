from rest_framework import permissions

class IsTheSameUser(permissions.BasePermission):
    """
        verify if the user whose sending the request
        to update his profile information is updating his
        own information not another user info
    """

    def has_object_permission(self, request, view, obj):

        # Instance must have an attribute named `owner`.
        return obj == request.user