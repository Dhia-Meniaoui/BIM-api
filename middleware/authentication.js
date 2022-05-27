const jwt = require('jsonwebtoken');
const User = require('../models/Users/User-model');
const Agency = require('../models/Users/Agency-model');
const Admin = require('../models/Users/admin-model');

// Authenticate a user  { req => token,user }
const authUser = async function (req, res, next) {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');
        console.log(token);
        const decode = await jwt.verify(token, '9ar9ouch');
        const user = await User.findOne({_id: decode.id, 'tokens.token': token});
        if (user) {
            req.user = user;
            req.token = token;
            next();
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(401).send({error: 'please authenticate'});
    }
}


// Authenticate an agency  { req => token,agency }
const authAgency = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = await jwt.verify(token, '9ar9ouch');
        const agency = await Agency.findOne({_id: decode.id, 'tokens.token': token});
        if (agency) {
            req.agency = agency;
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

module.exports = {authUser,authAdmin,authAgency};