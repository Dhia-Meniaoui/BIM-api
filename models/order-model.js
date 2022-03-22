const mongoose = require('mongoose');
const validator = require('validator').default;
const orderSchema = new mongoose.Schema({
//  Wheelchair
    steeringSystem: {
        type: Boolean
    },
    headset: {
        type: Boolean
    },
    wheelchair: {
        type: Boolean
    },
    mobileApp: {
        type: Boolean
    },
//  Safety
    obstacleDetection: {
        type: Boolean
    },
    camera: {
        type: Boolean
    },
    gps: {
        type: Boolean
    },
    notifications: {
        type: Boolean
    },
    sms: {
        type: Boolean
    },
//  Accessories
    securityBelt: {
        type: Boolean
    },
    headrest: {
        type: Boolean
    },
    mirror: {
        type: Boolean
    },
    table: {
        type: Boolean
    },
    rearCamera: {
        type: Boolean
    },
// Services
    trainingSession: {
        type: Boolean
    },
    trainingHours: {
        type: String | Number
    },
    control: {
        type: Boolean
    },
    controlYears: {
        type: String | Number
    },
    controlYearsAdded: {
        type: Number
    },
    demo: {
        type: Boolean
    },
//  Client Nature , individual or organisation
    clientNature: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ['individual', 'organisation']
    },
//  Individuals form
    iName: {
        type: String,
        trim: true
    },
    iEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value) && value!=='') {
                throw new Error('Email is not valid!')
            }
        }
    },
    iBirthday: {
        type: Date
    },
    iAddress: {
        type: String,
        trim: true
    },
    iZipCode: {
        type: Number
    },
    iPhone: {
        type: Number
    },
    iHandicap: {
        type: String,
        trim: true
    },
//  Organisation form
    oName: {
        type: String,
        trim: true
    },
    oType: {
        type: String,
        trim: true
    },
    oSector: {
        type: String,
        trim: true
    },
    oRegistrationNumber: {
        type: String,
        trim: true
    },
    oResponsibleName: {
        type: String,
        trim: true
    },
    oHandicap: {
        type: String,
        trim: true
    },
    oAddress: {
        type: String,
        trim: true
    },
    oZipCode: {
        type: Number
    },
    oPhone: {
        type: Number
    },
    oEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value) && value!=='') {
                throw new Error('Email is not valid!')
            }
        }
    }
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
