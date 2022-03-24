const mongoose = require('mongoose');

const lodgingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    location : {
        type : String,
        required : true,
        trim : true
    },
    state : {
        type : String,
        required : true,
        trim : true
    },
    area : {
        type : double,
        required : true,
    },
    Construction_year : {
        type : integer,
        required : true
    }
} , {timestamps : true});

lodgingSchema.methods.toJSON = function () {
const lodgingObject = this.toObject();
lodgingObject.id = lodgingObject._id;
delete lodgingObject._id;
delete lodgingObject.__v;
return lodgingObject;
}

const Lodging = mongoose.model('Lodging',lodgingSchema);
module.exports = Lodging;
