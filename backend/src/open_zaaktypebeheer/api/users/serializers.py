from django.utils.translation import gettext_lazy as _

from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    username = serializers.CharField(label=_("username"), required=True)
    first_name = serializers.CharField(label=_("first name"), required=False)
    last_name = serializers.CharField(label=_("last name"), required=False)
    email = serializers.EmailField(label=_("email"), required=False)
