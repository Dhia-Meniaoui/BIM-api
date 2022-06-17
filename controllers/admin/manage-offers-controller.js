const { response } = require('express');
const multer = require('multer');
const request = require('request-promise');
const fields = require('../../utils/utils');


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

// get prediction  { admin,authToken,accessorie => none }
const getprediction = async function (req, res) {
     
    let hause = req.body
    const template = [0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0]

    // Populate Year
    template[0]=body.req.area;
    // Populate Year
    template[0]=body.req.room;
    // Populate Year
    template[0]=body.req.year;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.basement)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.fitted_kitchen)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.terrasse)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.equipment)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.city)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.efficiency)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.Category)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === body.req.model)]=1;


    const options={
        method:"POST",
        url:"https://d8mxb91ad6.execute-api.us-east-1.amazonaws.com/BIM/",
        headers:{
          Accept:"application/json",
           "Content-Type":"application/x-www-form-urlencoded",
        },
        body:JSON.stringify({data:[template]})
      };

    

    try {
        response = await request(options);
        res.send(response);
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// Add accessorie  { admin,authToken,accessorie => none }
const addOffer = async function (req, res) {
    try {
        const imageURL = [];
        // console.log(req.files);
        req.files.forEach(file=>{
            imageURL.push(file.path.replace('public\\','/'));
        });
        const offer = new Offer({...req.body,imageURL});
        await offer.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
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


// Delete accessorie  { admin,authToken,accessorie's ID => none }
const deleteOffer = async function (req, res) {
    try {
        const deletedAccessorie = await Accessorie.findByIdAndDelete(req.params.id);
        deletedAccessorie ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}


const approveoffer = async function (req, res) {
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
    getOneOffer,
    getAllOffers,
    deleteOffer,
    getprediction,
    approveoffer
}
