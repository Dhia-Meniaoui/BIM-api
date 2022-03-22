const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    about : {
        type : String,
        default : ''
    },
    description : {
        type : String,
        required : true,
        trim : true
    },
    author : {
        type : String,
        default : 'Khawla Ben Ahmed',
        trim : true
    },
    imageURL : {
        type : String,
        default : '/images/articles/default.jpg'
    }
} , {timestamps : true});

articleSchema.methods.toJSON = function () {
const articleObject = this.toObject();
articleObject.id = articleObject._id;
delete articleObject._id;
delete articleObject.__v;
return articleObject;
}

const Article = mongoose.model('Article',articleSchema);
module.exports = Article;
