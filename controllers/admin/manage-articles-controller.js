const multer = require('multer');

const Article = require('../../models/article-model');

const fileStorage = multer.diskStorage({
    destination: ((req, file, callback) => {
        callback(null, 'public/images/articles');
    }),
    filename(req, file, callback) {
        callback(null, new Date().getTime() + '_' + file.originalname);
    }
})
const uploadImage = multer({
    storage: fileStorage,
    limits: {fileSize: 2000000},
    fileFilter(req, file, callback) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|webp)/)) {
            return callback(new Error('File must be an image'));
        }
        return callback(null, true);
    }
});


// Add a new article  { admin,authToken, article => none }
const addArticle = async function (req, res) {
    try {
        const article = new Article({...req.body, imageURL: '/images/articles/' + req.file.filename});
        await article.save();
        res.status(200).send()
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// This function will catch the errors thrown by uploadImage() function , it must have 4 parameters
const addArticleErrorCatcher = function (error, req, res, next) {
    res.status(400).send({error: error.message});
};

// Get one article { admin,authToken, article's ID => article }
const getOneArticle = async function (req, res) {
    try {
        const article = await Article.findById(req.params.id);
        article ? res.status(200).send(article) : res.status(404).send();
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
};


// Get many or all articles {request query => article }
const getManyArticles = async function (req, res) {
    try {
        const limit = req.query.limit ? +req.query.limit : undefined;
        const skip = req.query.limit && req.query.skip ? +req.query.skip : undefined;
        const articles = await Article.find({}).limit(limit).skip(skip).sort({createdAt: 'desc'});
        res.status(200).send(articles);
    } catch (error) {
        res.status(400).send();
    }
};

// Update article { admin,authToken,article's ID , update body => updated article }
const updateArticle = async function (req, res) {
    const updatedAllowed = ['title', 'about', 'description', 'author'];
    const updatesRequested = Object.keys(req.body);
    const isValidUpdate = updatesRequested.every((update) => {
        return updatedAllowed.includes(update);
    });
    if (!isValidUpdate) {
        return res.status(400).send({error: 'update is not valid'});
    }
    // check if an image was uploaded
    if (req.file) {
        req.body.imageURL = '/images/articles/' + req.file.filename
    }
    try {
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        updatedArticle ? res.status(200).send(updatedArticle) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Delete article { admin,authToken, article's ID => none }
const deleteArticle = async function (req, res) {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        deletedArticle ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
};


module.exports = {
    addArticle,
    addArticleErrorCatcher,
    uploadImage,
    deleteArticle,
    getOneArticle,
    getManyArticles,
    updateArticle
};