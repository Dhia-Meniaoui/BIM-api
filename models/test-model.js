const mongoose = require('mongoose');
const validator = require('validator').default;

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is not valid');
            }
        }
    },
    birthday: {
        type: Date,
        required: true
    },
    country: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    handicap: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    isValidated: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;