const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    date : {
        type: Date,
        required : true,
        index : {expires : '18h'}
    },
} , {timestamps : true});

const Event = mongoose.model('Event',eventSchema);
module.exports = Event;