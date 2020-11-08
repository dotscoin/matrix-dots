const AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-1'});
const config = require('./../../config.json')

const dynamodb = new AWS.DynamoDB.DocumentClient();

// class WalletDetails{
//     constructor(Key){
//         this.Key = Key;
//         this.tableName = config.aws_wallet_table;
//         this.dynamodb = dynamodb
//     }
//     get_data(){
//         const params = {TableName: this.tableName, Key:this.Key};
//         this.dynamodb.get(params, function(err, data){
//             if (err) {
//                 return false;}
//             else {
//                 return data.Item;
//             }
//         });
//     };
//     put_data(data){
//         this.data = data;
//         this.dynamodb.put(this.data, (err, data) => {
//             if (err) return false;
//             else return true;
//         });
//     };
// };

class WalletDetails{
    constructor(Key){
        this.Key = Key;
        console.log(this.Key);
        this.tableName = config.aws_wallet_table;
        this.dynamodb = dynamodb
    }
    promise_maker(){
        const params = {TableName: this.tableName, Key:this.Key};
        return new Promise((resolve, reject) => {
            try{
                this.dynamodb.get(params, function(err, data){
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(data)
                        }
                })
            }catch {
                return reject
            }
        })
    };
    async get_data(){
        let result = await this.promise_maker();
        // console.log(result);
        return result
      }
    put_data(data){
        this.data = data;
        this.dynamodb.put(this.data, (err, data) => {
            if (err) return false;
            else return true;
        });
    };
};

// class IdentityDetails{
//     constructor(Key){
//         this.Key = Key;
//         this.tableName = config.identity_dydb_table;
//         this.dynamodb = dynamodb
//     }
//     get_data(){
//         console.log('working')
//         const params = {TableName: this.tableName, Key:this.Key};
//         this.dynamodb.get(params, function(err, data){
//             if (err) {
//                 console.log('err');
//                 return false;
//             }
//             else {
//                 console.log(data.Item);
//                 return this.item;
//                 }
//         });
//     };
//     put_data(data){
//         this.data = data;
//         this.dynamodb.put(this.data, (err, data) => {
//             if (err) return false;
//             else return true;
//         });
//     };
// };

class IdentityDetails{
    constructor(Key){
        this.Key = Key;
        this.tableName = config.identity_dydb_table;
        this.dynamodb = dynamodb
    }
    promise_maker(){
        const params = {TableName: this.tableName, Key:this.Key};
        return new Promise((resolve, reject) => {
            try{
                this.dynamodb.get(params, function(err, data){
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(data)
                        }
                })
            }catch {
                return reject
            }
        })
    };
    async get_data(){
        let result = await this.promise_maker();
        return result
      }
    put_data(data){
        this.data = data;
        this.dynamodb.put(this.data, (err, data) => {
            if (err) return false;
            else return true;
        });
    };
};

module.exports = { IdentityDetails, WalletDetails }