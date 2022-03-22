const jwt = require('jsonwebtoken');
const Client = require('../models/client-model');
const Admin = require('../models/admin-model');

// Authenticate a client  { req => token,user }
const authClient = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = await jwt.verify(token, '9ar9ouch');
        const client = await Client.findOne({_id: decode.id, 'tokens.token': token});
        if (client) {
            req.client = client;
            req.token = token;
            next();
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(401).send({error: 'please authenticate'});
    }
}

const authAdmin = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');      
        const decode = await jwt.verify(token, '9ar9ouch');
        console.log(decode);
        const admin = await Admin.findOne({_id: decode.id, 'tokens.token': token});
        if (admin){
            req.admin = admin;
            req.token = token;
            next();
        }else {
            throw new Error();
        }
    }catch (error) {
        res.status(401).send({error : 'please authenticate as admin'});
    }
}

module.exports = {authClient,authAdmin};