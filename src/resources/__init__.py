from flask_restful import Resource
from flask import jsonify, request
from models import *
import requests

class Index(Resource):
    def get(self):
        return jsonify(message="this is the index page")

class LoginUser(Resource):
    def get(self):
        self.mnemonic = request.args.get('mnemonic')
        self.uuid = request.args.get('uuid')
        return jsonify(mnemonic=self.mnemonic, uuid=self.uuid)

class AddUser(Resource):
    def get(self):
        self.parentColab = request.args.get('parent_colab')
        self.url = "https://2khqa4xqm7.execute-api.ap-south-1.amazonaws.com/api/v1/get-address"
        self.headers = {'Content-Type': 'application/json'}
        self.userAddr = requests.get(url=self.url, headers=self.headers).json()
        #self.userAddr = self.userAddr.json()
        self.user = BaseUser(parent_colab=self.parentColab, address=self.userAddr.get('address'), colab=self.userAddr.get('colab'), uuid=self.userAddr.get('uuid'))
        db.session.add(self.user)
        db.session.commit()
        return jsonify(message='user added successfully', mnemonic=self.userAddr.get('mnemonic'), address=self.userAddr.get('address'), colab=self.userAddr.get('colab'))