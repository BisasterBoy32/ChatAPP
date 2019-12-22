from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile 
        fields = ("user","icon","born_date","join_date","active")
        read_only_fields = ["join_date","active","user"]

class RegisterSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ("username","password","email","first_name","profile")

    def create(self , validated_data):
        prfile_data = validated_data.pop("profile")
        user = User.objects.create(**validated_data)
        Profile.objects.create(
            user = user,
            **prfile_data
            )
        
        return user

    def validate(self , data):
        user_email = data["email"]
        users = User.objects.all()
        if users.filter(email = user_email).exists():
            raise serializers.ValidationError("this email already exists")
        return data