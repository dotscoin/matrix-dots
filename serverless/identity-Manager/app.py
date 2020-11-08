from chalice import Chalice
import boto3
from chalicelib import Address, jsonify, dynamoDb, Authenticator
from chalicelib.config import Config
from chalicelib.blueprint import BluePrintRegister
from chalicelib.decorators import jwt_required

app = Chalice(app_name='identity-Manager')
app.register_blueprint(BluePrintRegister.bluePrintIns)
dynamodb = boto3.resource('dynamodb')

@app.route('/v1/get-token', methods=["POST"])
def get_token():
    username = app.current_request.json_body.get('username')
    password = app.current_request.json_body.get('password')
    confirm = app.current_request.json_body.get('confirm')
    dydbTableObj = dynamodb.Table(Config.service_user_holder_table)
    resp = dydbTableObj.get_item(Key={'username': username}) 
    try:
        Item = resp.get('Item')
        if not Item.get('password') == password or not Item.get('confirm') == confirm: return jsonify(message='Invalid password/confirm', is_token=False)
        if not Item.get('is_active'): return jsonify(message='Inactive username', is_token=False)
    except: return jsonify(message='Invalid username', is_token=False)
    jwtToken = (Authenticator.create_token(username)).decode('utf-8')
    return jsonify(jwt_token=jwtToken, is_token=True)

@app.route('/v1/get-address')
#@jwt_required
def get_address():
    mnemonic, address, colab, uuid, walletId, walletKey, walletSecret = Address.generate_the_base()
    print ('aniket')
    print (walletId)
    data_for_identity = {'mnemonic': mnemonic, 'address':address, 'colab':colab, 'uuid':uuid, 'walletId':walletId}
    dynamoDb.put_data(data=data_for_identity)
    data_for_wallet = {'walletId':walletId, 'walletKey':walletKey, 'walletSecret':walletSecret, 'walletBalance': 0} 
    dynamoDb.put_data_to_wallet(data=data_for_wallet)
    return jsonify(mnemonic=Address.mnemonic, address=Address.address, colab=Address.colab, uuid=Address.uuid)

@app.route('/v1/recover-account', methods=['POST']) # forgot uuid (only possiable recovery item)
@jwt_required
def recover_account():
    mnemonic = app.current_request.json_body.get('mnemonic')
    if not mnemonic: return jsonify(message='enter a valid mnemonic', is_recovered=False)
    table = dynamodb.Table(Config.identity_dydb_table)
    allItems = dynamoDb.get_all_data(table)
    for item in allItems:
        if item.get('mnemonic') == mnemonic: return jsonify(message='account found', uuid=item.get('uuid'))
    return jsonify(message='Invalid mnemonic')


@app.route('/v1/change-identity', methods=['OPTIONS'])
@jwt_required
def change_identity():
    oldMnemonic = app.current_request.json_body.get('old_mnemonic')
    oldUuid = app.current_request.json_body.get('old_uuid')
    oldAddress = app.current_request.json_body.get('old_address')
    oldWalletId = app.current_request.json_body.get('old_wallet_id')
    dynamodbTable = dynamodb.Table(Config.identity_dydb_table)
    Item = dynamodbTable.get_item(Key={'uuid': oldUuid}).get('Item')
    if not Item: return jsonify(message='invalid uuid', is_identity_changed=False)
    if not Item.get('mnemonic') == oldMnemonic or not Item.get('address') == oldAddress or not Item.get('walletId') == oldWalletId: return jsonify(message='invalid mnemonic/address', is_identity_changed=True)
    dynamodbTable.delete_item(Key={'uuid': oldUuid})
    mnemonic, address, colab, uuid, walletId, walletKey, walletSecret = Address.generate_the_base()
    data = {'mnemonic': mnemonic, 'address': address, 'colab':colab, 'uuid': uuid, 'walletId': walletId}
    dynamoDb.put_data(data=data)
    dynamodbWalletTable = dynamodb.Table(Config.wallet_details_table)
    oldWalletBalance = dynamodbWalletTable.get(Key={'walletId': walletId}).get('Item').get('walletBalance')
    dynamodbWalletTable.delete_item(Key={'walletId':oldWalletId})
    Item = {'walletId': walletId, 'walletkey': walletKey, 'walletSecret':walletSecret, 'walletBalance':oldWalletBalance}
    dynamodbWalletTable.put_item(Item=Item)
    return jsonify(mnemonic=mnemonic, address=address, colab=colab, uuid=uuid)