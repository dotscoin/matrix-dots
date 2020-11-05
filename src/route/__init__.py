from configure_app import api
from resources import *

class RouteRunner:
    def __init__(self):
        self.routeResource = {
            "/" : "Index"
        }

        for self.route in self.routeResource.keys():
            self.routeResource = globals()[self.routeResource.get(self.route)]
            api.add_resource(self.routeResource, self.route)

RouteRunner = RouteRunner()