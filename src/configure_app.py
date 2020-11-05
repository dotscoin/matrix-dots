from create_app import app
from apis import api_bp
from flask import jsonify

app.debug = True
app.threaded = True
app.register_blueprint(api_bp)

# @app.errorhandler()
# def error_handler():
#     return jsonify(message='page/route not found.')