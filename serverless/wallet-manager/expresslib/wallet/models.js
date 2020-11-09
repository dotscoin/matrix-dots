const AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-1'});
const config = require('./../../config.json')

const dynamodb = new AWS.DynamoDB.DocumentClient();

class WalletDetails{
    constructor(Key){
        this.Key = Key;
        this.tableName = config.aws_wallet_table;
        this.dynamodb = dynamodb
    }
    promise_maker_for_get_data(){
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
        let result = await this.promise_maker_for_get_data();
        // console.log(result);
        return result
    }
    promise_maker_for_update_balance(){
        const params = {TableName: this.tableName, Key:this.Key,
            UpdateExpression: "set walletBalance = :wb",
            ExpressionAttributeValues:{
                ":wb" : this.balance
            },
            ReturnValues:"UPDATED_NEW"
        }
        return new Promise((resolve, reject) => {
            try{
                this.dynamodb.update(params, function(err, data){
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

    promise_maker_for_put_data(){
        const params = {TableName: this.tableName, Item:this.data};
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
    async put_data(data){
        this.data = data;
        let result = await this.promise_maker_for_put_data(this.data);
        console.log(result);
    };
    async update_balance(balance){
        this.balance = balance;
        let result = await this.promise_maker_for_update_balance(this.balance);
        // console.log(result);
        return result;
    };
};

class IdentityDetails{
    constructor(Key){
        this.Key = Key;
        this.tableName = config.identity_dydb_table;
        this.dynamodb = dynamodb
    }
    promise_maker_for_get_data(){
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
        let result = await this.promise_maker_for_get_data();
        return result
      }
};

module.exports = { IdentityDetails, WalletDetails }