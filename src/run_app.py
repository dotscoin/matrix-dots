from configure_app import app
from models import db

# class appRunner:
#     from apis import RouteRunner

def create_db():
    with app.app_context(): 
        db.create_all()
        print ('db created successfully')

if __name__ == '__main__':
    # appRunner = appRunner()
    app.run(host="0.0.0.0", port=8000)