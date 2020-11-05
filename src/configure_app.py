from create_app import app
from flask_restful import Api

app.debug = True
app.threaded = True
api = Api(app)
app=app