const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    Lodging: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lodging'
    },
    room : {
        type : String,
        required : true
    },
    efficiency_class : {
        type : String,
        required : true
    },
    basement : {
        type : String
    },
    fitted_kitchen : {
        type : String
    },
    terrasse : {
        type : String
    },
    equipment : {
        type : String
    }
}, {timestamps : true});

houseSchema.methods.toJSON = function () {
const houseObject = this.toObject();
delete houseObject.__v;
return houseObject;
}

const House = mongoose.model('House',houseSchema);
module.exports = House;
