const mongoose = require('mongoose');
const validator = require('validator').default;

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid!');
            }
        }
    },
    subject: {
        type: String,
        default: 'No subject',
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

contactUsSchema.methods.toJSON = function () {
    const contactObject = this;
    contactObject.id = contactObject._id;
    delete contactObject._id;
    delete contactObject.__v;
    return contactObject;
}

ContactUs = mongoose.model('ContactUs', contactUsSchema);
module.exports = ContactUs;
