from functools import wraps
from chalicelib import Authenticator, jsonify
from chalicelib.blueprint import self_bp
def jwt_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            jwtToken = self_bp.current_request.headers.get('authorization')[7:]
            print (jwtToken)
            if not Authenticator.validate_token(jwtToken):return jsonify(message='invalid authentication token')
            return f(*args, **kwargs)
        return decorated_function