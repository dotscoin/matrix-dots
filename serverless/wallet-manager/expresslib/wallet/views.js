const AWS = require('aws-sdk');
const { WalletDetails, IdentityDetails } = require('./models')

async function get_wallet_balance(walletId){
    const Key = {walletId: walletId};
    const wallet = new WalletDetails(Key)
    const data = await wallet.get_data();
    console.log(data)
    return data.Item.walletBalance
}

async function uuid_to_walletId(uuid){
    const Key = {uuid: uuid};
    const identity = new IdentityDetails(Key);
    const data = await identity.get_data();
    try{
        return data.Item.walletId;
    }catch {
        return false;
    }
}

async function update_wallet_balance(walletId, balance){
    const Key = {walletId: walletId};
    const wallet = new WalletDetails(Key);
    const message = await wallet.update_balance(balance);
    //console.log(message);
    return message;
}

module.exports = { get_wallet_balance, uuid_to_walletId, update_wallet_balance }