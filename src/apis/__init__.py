from resources import *
from flask import Blueprint
from flask_restful import Api

routeResourceDict = {
    "/" : "index",
    "/api/v1/add-user": "addUser",
    "/api/v1/login-user": "loginUser"
}

class RouteRunner:
    def __init__(self):
        self.api = api
        self.routeResourceDict = routeResourceDict
        for self.route in self.routeResourceDict.keys():
            self.routeResourceFunc = globals()[self.routeResourceDict.get(self.route)]
            self.api.add_resource(self.routeResourceFunc, self.route)

api_bp = Blueprint('api', __name__)
api = Api(api_bp)
RouteRunner()