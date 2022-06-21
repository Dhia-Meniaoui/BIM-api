const multer = require('multer');

const Offer = require('../../models/Offers/Offers-model');
const Buy = require('../../models/Offers/Buy-model');
const User = require('../../models/Users/User-model');
const House = require('../../models/Lodging/House-model');
const Lodging = require('../../models/Lodging/Lodging-model');

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
        
        let user = await User.findById(req.body.user)

        let lodging = new Lodging({
            title: "test",
            location: req.body.city,
            Category: req.body.Category,
            model: req.body.model,
            area: req.body.area,
            Construction_year : req.body.year
        })
        await lodging.save();

        let house = new House({
            Lodging: lodging,
            room : req.body.room,
            Type: "house",
            bassement : req.body.bassement ,
            fitted_kitchen : req.body.fitted_kitchen,
            Terrasse : req.body.Terrasse ,
            Equipment : req.body.Equipment,

        })
        await house.save();

        let offer = new Offer({
            owner: user,
            Lodging: lodging,
            Description : req.body.description
        })
        await offer.save();

        let offerbuy = new Buy({
            offer: offer,
            cost : req.body.price,
            approved : "false",
            pending: "false"
        })

        console.log(offerbuy);
  
        await offerbuy.save();
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
