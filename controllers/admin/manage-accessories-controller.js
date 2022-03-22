const multer = require('multer');

const Accessorie = require('../../models/accessorie-model');

const fileStorage = multer.diskStorage({
    destination: ((req, file, callback) => {
        callback(null, 'public/images/accessories');
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

// Add accessorie  { admin,authToken,accessorie => none }
const addAccessorie = async function (req, res) {
    try {
        const imageURL = [];
        // console.log(req.files);
        req.files.forEach(file=>{
            imageURL.push(file.path.replace('public\\','/'));
        });
        const accessorie = new Accessorie({...req.body,imageURL});
        await accessorie.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// This function will catch the errors thrown by uploadImage() function , it must have 4 parameters
const addAccessorieErrorCatcher = function (error, req, res, next) {
    res.status(400).send({error: error.message});
};

// Get accessorie  { accessorie's id => accessorie }
const getOneAccessorie = async function (req, res) {
    try {
        const accessorie = await Accessorie.findById(req.params.id);
        if (!accessorie) {
            return res.status(404).send();
        }
        res.status(200).send(accessorie);
    } catch (error) {
        res.status(400).send();
    }
};


// Get all accessories  { none => accessories }
const getAllAccessories = async function (req, res) {
    try {
        const accessories = await Accessorie.find().sort({createdAt: 'asc'});
        res.status(200).send(accessories);
    } catch (error) {
        res.status(500).send();
    }
};

// Update accessorie  { admin,authToken,accessorie's ID , update body => updated accessorie }
const updateAccessorie = async function (req, res) {
    const updatesAllowed = ['name', 'description', 'price', 'isAvailable'];
    const updatesRequested = Object.keys(req.body);
    const isValidUpdate = updatesRequested.every((update) => {
        return updatesAllowed.includes(update);
    });
    if (!isValidUpdate) {
        return res.status(400).send({error: 'update not valid'});
    }
    if (req.file) {
        req.body.imageURL = '/images/accessories/' + req.file.filename
    }
    try {
        const updatedAccessorie = await Accessorie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        updatedAccessorie ? res.status(200).send(updatedAccessorie) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Delete accessorie  { admin,authToken,accessorie's ID => none }
const deleteAccessorie = async function (req, res) {
    try {
        const deletedAccessorie = await Accessorie.findByIdAndDelete(req.params.id);
        deletedAccessorie ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

module.exports = {
    uploadImage,
    addAccessorie,
    addAccessorieErrorCatcher,
    getOneAccessorie,
    getAllAccessories,
    deleteAccessorie,
    updateAccessorie
}
