const mongoose = require('mongoose');
const trainingSessionRequestSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    clientID  : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    hours : {
        type : Number,
        required : true
    },
    phone : {
        type : String,
        default : ''
    },
    isOnHold : {
        type : Boolean,
        default : true
    }
},{timestamps : true});

const TrainingSessionRequest = mongoose.model('TrainingSessionRequest',trainingSessionRequestSchema) ;
module.exports = TrainingSessionRequest;
