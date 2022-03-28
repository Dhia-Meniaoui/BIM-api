const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator').default;


const userSchema = new mongoose.Schema({
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

userSchema.virtual('feedback', {
    ref: 'Feedback',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('maintenanceRequest', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('qualityControl', {
    ref: 'QualityControl',
    localField: '_id',
    foreignField: 'owner'
});

// Hash password before saving a user
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Find by email and check password
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await user.findOne({email: email});
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    // reaching this line means that email exists with the given password
    return user;
};

// Generate token for created or signed user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    try {
        return await jwt.sign({id: user.id}, '9ar9ouch');
    } catch (error) {
        return {error: 'Unable to generate authentication token!'}
    }
}

// Delete unnecessary (for the user) fields from the user object returned to user
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    userObject.id = userObject._id;
    delete userObject._id;
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.isBanned;
    delete userObject.__v;
    return userObject;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
