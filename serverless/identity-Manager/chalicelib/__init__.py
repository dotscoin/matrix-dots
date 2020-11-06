from base58 import b58encode
from hashlib import md5, sha1 
from mnemonic import Mnemonic
from uuid import uuid4
from time import time
from datetime import datetime, timedelta
from chalicelib.config import Config
import boto3, jwt

def jsonify(**kwargs):
    return kwargs

class Address:
    def __init__(self):
        self.mnemo = Mnemonic("english")
    
    def generate_the_base(self):
        self.mnemonic = self.mnemo.generate(strength=256)
        self.privKey = sha1(self.mnemonic.encode('utf-8')).hexdigest()
        self.address = (b58encode(self.privKey.encode('utf-8'))).decode('utf-8')
        self.preColab = md5(self.privKey.encode('utf-8')).hexdigest()
        self.colab = (b58encode(self.preColab)).decode('utf-8')
        self.uuid = str(uuid4())
        return (self.mnemonic, self.address, self.colab, self.uuid)

class DynamodbHandler:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
    def put_data(self, data={}):
        self.data = data
        self.identity_dydb_table = self.dynamodb.Table(Config.identity_dydb_table)
        self.identity_dydb_table.put_item(Item=self.data)

class Authenticator:
    def __init__(self):
        self.jwtAlgorithm = 'HS256'
        self.jwtSecret = 'aniketsarkar'
        self.jwtExpDeltaSec = 300
    def create_token(self, username):
        self.payload = {'username': username, 'exp': datetime.utcnow()+timedelta(seconds=self.jwtExpDeltaSec)}
        self.jwt_token = jwt.encode(self.payload, self.jwtSecret, self.jwtAlgorithm)
        return self.jwt_token
    def validate_token(self, jwtToken):
        self.jwtToken = jwtToken
        try: 
            self.payload = jwt.decode(self.jwtToken, self.jwtSecret, algorithms=[self.jwtAlgorithm])
            return True
        except (jwt.DecodeError, jwt.ExpiredSignatureError): return False
        

Address=Address()
dynamoDb = DynamodbHandler()
Authenticator= Authenticator()