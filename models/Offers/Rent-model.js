const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    offer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Offer'
    },
    periode : {
        type : String
    },
    cost : {
        type : double,
        required : true
    },
    Description : {
        type : String
    }
});

rentSchema.methods.toJSON = function () {
const rentObject = this.toObject();
delete rentObject.__v;
return rentObject;
}

const Rent = mongoose.model('Rent',rentSchema);
module.exports = Rent;
