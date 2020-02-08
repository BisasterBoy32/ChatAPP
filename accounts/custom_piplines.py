from django.core.exceptions import ObjectDoesNotExist
import requests
from requests import HTTPError
from .models import Profile

def create_profile(backend, user, response, *args, **kwargs):
    # check if there is a profile for this user
    try :
        profile = user.profile
    # if there is no profile create one for this user
    except ObjectDoesNotExist :
        if backend.name == "facebook":
            # get this user picture
            id = response['id']
            url = "https://graph.facebook.com/{}/picture".format(id)
            try:
                picture_res = requests.get(url ,params={"type":"large","redirect":"false"})
                picture_url = picture_res.json()['data']['url']
            except HTTPError:
                # if the request failed hand the user a random picture
                picture_url = "https://127.0.0.1:8000/static/icons/icon-1.jpg"

        elif backend.name == "google-oauth2":
            picture_url = response.get('picture')

        profile = Profile.objects.create(
            user = user,
            icon = picture_url,
            # since i cant access the birthday of the facebook user
            # i generate a random one
            born_date = "2000-12-05T12:30"
        )
        profile.save()   