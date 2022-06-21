const mongoose = require('mongoose');

const lodgingSchema = new mongoose.Schema({
    title: {
        type : String,
        trim : true
    },
    location: {
        type : String,
        required : true,
        trim : true
    },
    Category: {
        type : String,
        required : true,
        trim : true
    },
    model: {
        type : String,
        required : true,
        trim : true
    },
    area: {
        type : String,
        required : true,
        trim : true
    },
    Construction_year: {
        type : String,
        required : true,
        trim : true
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
