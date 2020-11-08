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
    const identity = new IdentityDetails(Key)
    const data = await identity.get_data();
    console.log(data)
    return data.Item.walletId
}

// async function uuid_to_walletId(uuid){
//     return new Promise( async(resolve, reject) => {
//         const Key = {uuid: uuid}
//         const identity = new IdentityDetails(Key)
//         const data = await identity.get_data()
//         console.log(data.Item)
//         try {
//             console.log('data')
//             console.log(data.Item.walletId)
//             resolve(data.Item.walletId)
//         }
//         catch{
//             reject('err')
//         }
//         })
// }


module.exports = { get_wallet_balance, uuid_to_walletId }