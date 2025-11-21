from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class that primarily looks for the access token in 
    HTTP-only cookies instead of the Authorization header.
    """
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access')

        if raw_token is None:
            return None 

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            return (user, validated_token)
            
        except exceptions.AuthenticationFailed as e:
            raise exceptions.AuthenticationFailed(str(e))
            
        except Exception:
            return None