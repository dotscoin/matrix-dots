from create_app import app
from apis import api_bp
from flask import jsonify, session
from models import db
from datetime import timedelta

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///matrix.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.debug = True
app.threaded = True
app.register_blueprint(api_bp)
db.init_app(app)

@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=20)
    session.modified = True

@app.errorhandler(404)
def not_found_error(e):
     return jsonify(message='page/route not found.'), 404