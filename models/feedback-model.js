const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    rating : {
        type :Number,
        default : 5
    },
    comment : {
        type : String,
        default : '',
        trim : true
    },
    isValidated : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Client'
    }
},{timestamps : true});

feedbackSchema.methods.toJSON = function () {
const feedbackObject = this.toObject();
delete feedbackObject._id;
delete feedbackObject.owner;
delete feedbackObject.createdAt;
delete feedbackObject.updatedAt;
delete feedbackObject.__v;
return feedbackObject;
}

const Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports = Feedback;