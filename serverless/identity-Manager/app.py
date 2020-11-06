from chalice import Chalice
from chalicelib import Address, jsonify, dynamoDb

app = Chalice(app_name='identity-Manager')

@app.route('/')
def index():
    return {'hello': 'world'}

@app.route('/v1/get-address')
def get_address():
    mnemonic, address, colab, uuid = Address.generate_the_base()
    data = {'mnemonic': mnemonic, 'address': address, 'colab':colab, 'uuid': uuid}
    dynamoDb.put_data(data=data)
    return jsonify(mnemonic=mnemonic, address=address, colab=colab, uuid=uuid)