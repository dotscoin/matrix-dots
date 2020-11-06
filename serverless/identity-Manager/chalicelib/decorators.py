from functools import wraps
from chalicelib import Authenticator, jsonify
from chalicelib.blueprint import BluePrintRegister
def jwt_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            argData = BluePrintRegister.bluePrintIns.current_request.headers.get('authorization')
            if not argData or not " " in argData: return jsonify(message='missing authentication token')
            jwtToken = argData.split(' ')[1]
            print (jwtToken)
            if not Authenticator.is_token_valid(jwtToken):return jsonify(message='invalid authentication token')
            return f(*args, **kwargs)
        return decorated_function