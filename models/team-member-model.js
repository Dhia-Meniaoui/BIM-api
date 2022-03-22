const mongoose = require('mongoose');
const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    post: {
        type: String,
        required: true,
        trim: true
    },
    imageURL: {
        type: String,
        required: true
    }
});

teamMemberSchema.methods.toJSON = function () {
    const teamMemberObject = this.toObject();
    teamMemberObject.id = teamMemberObject._id;
    delete teamMemberObject._id;
    delete teamMemberObject.__v;
    return teamMemberObject;
}

const TeamMember = mongoose.model('TeamMember' , teamMemberSchema);
module.exports = TeamMember;
