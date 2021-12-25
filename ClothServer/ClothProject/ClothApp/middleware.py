import json

from django.http import QueryDict

class add_token_middleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path in ['/o/token', '/o/token/']:
            q = QueryDict.copy(request.POST)
            json_body = json.loads(request.body)

            q.__setitem__("client_id","pRFqAMyXJ0cxedO7eQYhMkaR0EvBMu0UO0YIiM4y" )
            q.__setitem__('client_secret', "p009HkI3QtO4FJLSGhOxcJciwydYNkuGMgMOTJ7DsAQzQlaEjFxwKgbXFaqK0Qb73GE3V3rpHDm4fakAb2mBuFqCYwBANN7cqs9ctW70RhHIF7RTTJ7i6XAUXKmHZZNc")
            q.__setitem__('username', json_body['username'])
            q.__setitem__('password', json_body['password'])
            q.__setitem__('grant_type', json_body['grant_type'])
            request.POST = q
            print(q)

        response = self.get_response(request)

        return response