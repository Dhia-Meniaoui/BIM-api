const mongoose = require('mongoose');

const appartementSchema = new mongoose.Schema({
    Lodging: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lodging'
    },
    room : {
        type : integer,
        required : true
    },
    living_space : {
        type : double,
        required : true,
    },
    Stage : {
        type : double,
        required : true,
    },
    Type : {
        type : String,
        required : true, 
        trim : true
    }
});

appartementSchema.methods.toJSON = function () {
const appartementObject = this.toObject();
delete appartementObject.__v;
return appartementObject;
}

const Appartement = mongoose.model('Appartement',appartementSchema);
module.exports = House;
