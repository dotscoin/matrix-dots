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

app.post('/api/v1/get-token', (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const confirm = req.body.confirm;
    const params = {TableName: config.aws_service_user_name_table, Key:{username: username}};
    dynamodb.get(params, function(err, data){
        if (err) {
            res.send({message:'failed to get user data', is_token: false});
        }else{
            try{
                const user_is_active = data.Item.is_active;
                const dbPassword = data.Item.password;
                const dbConfirm = data.Item.confirm;
                if (dbPassword !== password || dbConfirm !== confirm){
                    res.send({message: 'Invalid user password/confirm'})
                }
                else if (!user_is_active) {
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

app.post('/api/v1/login-user', authenticateToken, (req, res) =>{
    const mnemonic = req.body.mnemonic;
    const uuid = req.body.uuid;
    const timestamp = new Date(new Date().toUTCString());
    const Item = {mnemonic:mnemonic, uuid:uuid, timestamp:timestamp};
    const params = {
        TableName: config.aws_table_name,
        Key:{uuid: uuid}
    };

    dynamodb.get(params, function(err, data) {
        if (err) {
            res.send({message:'failed to get user data', is_login: false, err:err});
        }else{
            try{
                const dbMnemonic = data.Item.mnemonic;
                if (dbMnemonic !== mnemonic)
                {res.send({message: 'invalid mnemonic', is_login: false})}
                else{
                res.send({message:'user login successfull', is_login:true})};
            }catch{
                res.send({message: 'invalid uuid', is_login:false});
            }
        }
    });
});

app.listen(port);
module.exports.handler = serverless(app);