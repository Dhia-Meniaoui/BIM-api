const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator').default;

// Define the schema for the client
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    clientID: {
        // verify with khawla how should clientID be
        required: true,
        unique: true,
        type: String,
        trim: true
    },
    phone: {
      required : false,
        type : String,
        trim : true,
      default : ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid!');
            }
        }
    },
    country: {
        required: true,
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

clientSchema.virtual('feedback', {
    ref: 'Feedback',
    localField: '_id',
    foreignField: 'owner'
});

clientSchema.virtual('maintenanceRequest', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'owner'
});

clientSchema.virtual('qualityControl', {
    ref: 'QualityControl',
    localField: '_id',
    foreignField: 'owner'
});

// Hash password before saving a client
clientSchema.pre('save', async function (next) {
    const client = this;
    if (client.isModified('password')) {
        client.password = await bcrypt.hash(client.password, 8);
    }
    next();
});

// Find by email and check password
clientSchema.statics.findByCredentials = async function (email, password) {
    const client = await Client.findOne({email: email});
    if (!client) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    // reaching this line means that email exists with the given password
    return client;
};

// Generate token for created or signed clients
clientSchema.methods.generateAuthToken = async function () {
    const client = this;
    try {
        return await jwt.sign({id: client.id}, '9ar9ouch');
    } catch (error) {
        return {error: 'Unable to generate authentication token!'}
    }
}

// Delete unnecessary (for the client) fields from the client object returned to client
clientSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    userObject.id = userObject._id;
    delete userObject._id;
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.isBanned;
    delete userObject.__v;
    return userObject;
}

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
