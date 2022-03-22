const mongoose = require('mongoose');
const validator = require('validator').default;
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email no valid');
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 8
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{timestamps : true});

// Hash password before saving the admin
adminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

// Generate token for created or signed admin
adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    try {
        const token = await jwt.sign({id: admin.id}, '9ar9ouch', {expiresIn: '365d'})
        return token;
    } catch (error) {
        return {error: 'Unable to generate authentication token!'}
    }
}

// Find by email and check password
adminSchema.statics.findByCredentials = async function (email, password) {
    const admin = await Admin.findOne({email: email});
    if (!admin) {
        throw new Error('Unable to login admin');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new Error('unable to login ad');
    }
    // reaching this line means that email exists with the given password
    return admin;
};

// Delete unnecessary (for the admin) fields from the admin object returned to admin
adminSchema.methods.toJSON = function () {
    const adminObject = this.toObject();
    delete adminObject.password;
    delete adminObject.tokens;
    return adminObject;
}

const Admin = mongoose.model('Admin',adminSchema);
module.exports = Admin;