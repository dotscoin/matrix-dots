from create_app import app
from apis import api_bp
from flask import jsonify
from models import db

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///matrix.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.debug = True
app.threaded = True
app.register_blueprint(api_bp)
db.init_app(app)

# @app.errorhandler()
# def error_handler():
#     return jsonify(message='page/route not found.')