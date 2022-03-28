const multer = require('multer');
const Joiner = require('../../models/Notifications/join-us-model');
const partner = require('../../models/partenaire');


const fileStorage = multer.diskStorage({
    destination: ((req, file, callback) => {
        callback(null, 'public/join-us-cv');
    }),
    filename(req, file, callback) {
        callback(null, new Date().getTime() + '_' + file.originalname);
    }
})

const upload = multer({
    storage: fileStorage,
    limits: {fileSize: 10000000},
    fileFilter(req, file, callback) {
        if (!file.originalname.toLowerCase().match(/\.(pdf)/)) {
            return callback(new Error('CV must be a PDF'));
        }
        return callback(null, true);
    }
});


// Join us  { join application => none }
const apply = async function (req, res) {
    try {
        const joiner = new Joiner({...req.body, cvURL: '/join-us-cv/' + req.file.filename});
        await joiner.save();    
        res.status(200).send();
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error.toString()});
    }
};

const applyErrorCatcher = function (error, req, res, next) {
    res.status(400).send({error: error.message});
}







module.exports = {upload,apply,applyErrorCatcher};
