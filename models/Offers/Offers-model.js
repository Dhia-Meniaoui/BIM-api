const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    Lodging: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging'
    },
    Postion : {
        type : String
    },
    Description : {
        type : String
    },
    images : {
        type : String
    }
}, {timestamps: true});

OfferSchema.methods.toJSON = function () {
const houseObject = this.toObject();
delete houseObject.__v;
return houseObject;
}

const Offer = mongoose.model('Offer',OfferSchema);
module.exports = Offer;
