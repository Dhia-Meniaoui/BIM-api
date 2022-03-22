const mongoose = require('mongoose');



const CEOSchema = new mongoose.Schema({
    nameCEO : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        trim : true
    },
    phone : {
        type : String
    },
    mobile : {
        type : String       
    }
},{timestamps:true});




const partenaireSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true
    },
    status : {
        type : String
    },
    motivation : {
        type : String,
        default : 'No motivation provided'
    },  
    CEO: CEOSchema
},{timestamps:true});

const partner = mongoose.model('partner',partenaireSchema);

module.exports = partner;