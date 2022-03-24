const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
    Lodging: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lodging'
    },
    Type : {
        type : String,
        required : true, 
        trim : true
    }
});

garageSchema.methods.toJSON = function () {
const garageObject = this.toObject();
delete garageObject.__v;
return garageObject;
}

const Garage = mongoose.model('Garage',garageSchema);
module.exports = Garage;
