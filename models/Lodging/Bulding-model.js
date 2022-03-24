const mongoose = require('mongoose');

const BuldingSchema = new mongoose.Schema({
    Lodging: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lodging'
    },
    Floor : {
        type : integer,
        required : true
    },
    living_space : {
        type : double,
        required : true,
    },
    Rentable_area_approx : {
        type : double,
        required : true,
    },
    appartements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'appartement'
        }
    ],
    Type : {
        type : String,
        required : true, 
        trim : true
    }
});

BuldingSchema.methods.toJSON = function () {
const buldingObject = this.toObject();
delete buldingObject.__v;
return buldingObject;
}

const Bulding = mongoose.model('Bulding',BuldingSchema);
module.exports = Bulding;
