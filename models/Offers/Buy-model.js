const mongoose = require('mongoose');

const buySchema = new mongoose.Schema({
    offer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Offer'
    },
    periode : {
        type : String
    },
    cost : {
        type : String,
        required : true
    },
    Description : {
        type : String
    },
    approved : {
        type : String
    },
    pending : {
        type : String
    }
});

buySchema.methods.toJSON = function () {
const houseObject = this.toObject();
delete houseObject.__v;
return houseObject;
}

const Buy = mongoose.model('Buy',buySchema);
module.exports = Buy;
