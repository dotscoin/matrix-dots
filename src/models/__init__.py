from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class BaseUser(db.Model):
    __tablename__ = 'base_user'
    id = db.Column(db.Integer, primary_key=True, unique=True)
    parent_colab = db.Column(db.String(200), unique=False)
    address = db.Column(db.String(200), unique=True)
    colab = db.Column(db.String(200), unique=True)
    uuid = db.Column(db.String(200), unique=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow())
