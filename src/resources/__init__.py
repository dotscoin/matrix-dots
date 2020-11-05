from flask_restful import Resource
from flask import jsonify

class index(Resource):
    def get(self):
        # printreturn {'hello':'world'}
        return jsonify(message="this is the index page")

class loginManager(Resource):
    def get(self,mnemonic, uuid):
        #return {'hello':'world'}
        return jsonify(mnemonic=mnemonic, uuid=uuid)