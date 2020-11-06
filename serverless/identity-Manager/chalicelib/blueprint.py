from chalice import Blueprint

class BluePrintRegister:
    def __init__(self):
        self.bluePrintIns = Blueprint(__name__)

BluePrintRegister = BluePrintRegister()