const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    House: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House'
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
const offerObject = this.toObject();
delete offerObject.__v;
return offerObject;
}

const Offer = mongoose.model('Offer',OfferSchema);
module.exports = Offer;
