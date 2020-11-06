const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
AWS.config.update({region:'ap-south-1'});
const config = require('./config.json');
const { generateAccessToken, authenticateToken } = require('./expresslib/resources');

const app = express();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/v1/get-token', (req, res) =>{
    const username = req.query.username;
    const params = {TableName: config.aws_service_user_name_table, Key:{username: username}};
    dynamodb.get(params, function(err, data){
        if (err) {
            res.send({message:'failed to get user data', is_token: false, err:err});
        }else{
            try{
                const user_is_active = data.Item.is_active;
                if (!user_is_active) {
                    res.send({message:'inactive username', is_token: false});
                }
                else {
                    const accessToken = generateAccessToken(username);
                    res.send({access_token: accessToken, is_token: true});
                }
            }catch{
                res.send({message:'invalid username', is_token: false});
            }
        }
    })
});

app.get('/api/v1/get-pricing', authenticateToken, (req, res) => {
    const pricingType = req.query.pricing_type;
    const params = {TableName: config.aws_pricing_table_name, Key:{all_pricing: 'all_pricing'}};
    if (!pricingType) {
        dynamodb.get(params, function(err, data){
            if (err) {res.send({message:'failed to fetch pricing information', is_pricing: false, err:err})
            }else{
                const all_pricing = data.Item.pricing_det;
                res.send(all_pricing);
            }
        })
    }else{
        const pricingTypeArgArr = ['account_recovery']
        if(pricingTypeArgArr.indexOf(pricingType.toLocaleLowerCase()) === -1){
            res.send({message: 'invalid pricing type', is_pricing:false})
        }else{
            dynamodb.get(params, function(err, data){
                if (err) {res.send({message:'failed to fetch pricing information', is_pricing: false, err:err})
                }else{
                    const all_pricing = data.Item.pricing_det;
                    if (pricingType.toLocaleLowerCase() === 'account_recovery'){
                        const account_recovery = all_pricing.account_recovery
                        res.send({price_for_account_recovery: account_recovery})
                    }
                }
            })
        }
    }
})

// app.get('/api/v1/')

app.listen(port);
module.exports.handler = serverless(app);