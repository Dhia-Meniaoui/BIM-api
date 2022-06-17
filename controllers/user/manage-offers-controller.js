const multer = require('multer');

const Offer = require('../../models/Offers/Offers-model');

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
const addOffer = async function (req, res) {
    try {
        const imageURL = [];
        // console.log(req.files);
        req.files.forEach(file=>{
            imageURL.push(file.path.replace('public\\','/'));
        });
        const offer = new Offer({...req.body,imageURL});
        offer.approved = false;
        offer.approved = false;
        await offer.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// This function will catch the errors thrown by uploadImage() function , it must have 4 parameters
const addOfferRequestErrorCatcher = function (error, req, res, next) {
    res.status(400).send({error: error.message});
};

// Get accessorie  { accessorie's id => accessorie }
const getOneOffer = async function (req, res) {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).send();
        }
        res.status(200).send(offer);
    } catch (error) {
        res.status(400).send();
    }
};


// Get all accessories  { none => accessories }
const getAllOffers = async function (req, res) {
    try {
        const Offers = await Offer.find().sort({createdAt: 'asc'});
        res.status(200).send(Offers);
    } catch (error) {
        res.status(500).send();
    }
};

// Update accessorie  { admin,authToken,accessorie's ID , update body => updated accessorie }
const updateOffer = async function (req, res) {
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
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        updatedOffer ? res.status(200).send(updatedOffer) : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

// Delete accessorie  { admin,authToken,accessorie's ID => none }
const deleteOffer = async function (req, res) {
    try {
        const deletedAccessorie = await Accessorie.findByIdAndDelete(req.params.id);
        deletedAccessorie ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}

module.exports = {
    uploadImage,
    addOffer,
    addOfferRequestErrorCatcher,
    getOneOffer,
    getAllOffers,
    deleteOffer,
    updateOffer
}
