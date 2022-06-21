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
    Type : {
        type : String,
        required : true, 
        trim : true
    }
});

houseSchema.methods.toJSON = function () {
const houseObject = this.toObject();
delete houseObject.__v;
return houseObject;
}

const House = mongoose.model('House',houseSchema);
module.exports = House;
