from resources import *
from flask import Blueprint
from flask_restful import Api

routeResourceDict = {
    "/" : "index",
    "/api/v1/login/<mnemonic>/<uuid>": "loginManager"
}

class RouteRunner:
    def __init__(self):
        self.api = api
        self.routeResourceDict = routeResourceDict
        for self.route in self.routeResourceDict.keys():
            # print (self.route)
            # print (self.routeResource[self.route])
            self.routeResourceFunc = globals()[self.routeResourceDict.get(self.route)]
            self.api.add_resource(self.routeResourceFunc, self.route)

api_bp = Blueprint('api', __name__)
api = Api(api_bp)
RouteRunner = RouteRunner()