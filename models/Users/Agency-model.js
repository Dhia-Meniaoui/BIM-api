const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator').default;

// Define the schema for the client
const agencySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    logo: {
        type: String ,
        required: true
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

agencySchema.virtual('feedback', {
    ref: 'Feedback',
    localField: '_id',
    foreignField: 'owner'
});

agencySchema.virtual('maintenanceRequest', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'owner'
});

agencySchema.virtual('qualityControl', {
    ref: 'QualityControl',
    localField: '_id',
    foreignField: 'owner'
});

// Hash password before saving a agency
agencySchema.pre('save', async function (next) {
    const agency = this;
    if (agency.isModified('password')) {
        agency.password = await bcrypt.hash(agency.password, 8);
    }
    next();
});

// Find by email and check password
agencySchema.statics.findByCredentials = async function (email, password) {
    const agency = await agency.findOne({email: email});
    if (!agency) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    // reaching this line means that email exists with the given password
    return agency;
};

// Generate token for created or signed agency
agencySchema.methods.generateAuthToken = async function () {
    const agency = this;
    try {
        return await jwt.sign({id: agency.id}, '9ar9ouch');
    } catch (error) {
        return {error: 'Unable to generate authentication token!'}
    }
}

// Delete unnecessary (for the agency) fields from the agency object returned to client
agencySchema.methods.toJSON = function () {
    const userObject = this.toObject();
    userObject.id = userObject._id;
    delete userObject._id;
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.isBanned;
    delete userObject.__v;
    return userObject;
}

const Agency = mongoose.model('Agency', agencySchema);
module.exports = Agency;
