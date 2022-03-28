const mongoose = require('mongoose');
const validator = require('validator').default;

const joinerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is not valid!')
            }
        }
    },
    cvURL : {
        type : String,
        required : true
    },
    applyType : {
        type : String,
        required : true,
        lowercase : true,
        trim: true,
        enum : ['job' , 'internship']
    },
    motivation : {
        type : String,
        default : 'No motivation provided'
    }
},{timestamps:true});

const Joiner = mongoose.model('Joiner',joinerSchema);

module.exports = Joiner;