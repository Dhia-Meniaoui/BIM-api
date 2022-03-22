const mongoose = require('mongoose');

const accessorieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
    },
    imageURL: [{
        type: String,
        required: true
    }],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

accessorieSchema.methods.toJSON = function () {
const accessorieObject = this.toObject();
delete accessorieObject.__v;
return accessorieObject;
}

const Accessorie = mongoose.model('Accessorie',accessorieSchema);


module.exports = Accessorie;
