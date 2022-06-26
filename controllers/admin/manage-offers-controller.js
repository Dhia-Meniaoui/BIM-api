const { response } = require('express');
const multer = require('multer');
const request = require('request-promise');

const fields = [
    "area",
    "room",
    "year",
    "basement",
    "fitted_kitchen",
    "terrasse",
    "equipment",
    "city_aachen ",
    "city_augsburg ",
    "city_berlin",
    "city_bielefeld ",
    "city_bl-baden-wuerttemberg",
    "city_bochum ",
    "city_bonn ",
    "city_braunschweig",
    "city_bremen ",
    "city_chemnitz-sachs ",
    "city_dortmund ",
    "city_dresden ",
    "city_duesseldorf ",
    "city_duisburg ",
    "city_essen ",
    "city_frankfurt-am-main",
    "city_gelsenkirchen ",
    "city_hamburg ",
    "city_hannover ",
    "city_karlsruhe ",
    "city_kiel ",
    "city_koeln ",
    "city_leipzig ",
    "city_mannheim ",
    "city_moenchengladbach",
    "city_muenchen ",
    "city_muenster ",
    "city_nuernberg ",
    "city_stuttgart ",
    "city_wiesbaden ",
    "city_wuppertal ",
    "efficiency_class_A",
    "efficiency_class_A+",
    "efficiency_class_B",
    "efficiency_class_C",
    "efficiency_class_D",
    "efficiency_class_E",
    "efficiency_class_F",
    "efficiency_class_G",
    "efficiency_class_H",
    "Category_Bungalow",
    "Category_Doppelhaushälfte",
    "Category_Einfamilienhaus",
    "Category_Mehrfamilienhaus",
    "Category_Reihenendhaus",
    "Category_Reihenmittelhaus",
    "Category_Stadthaus",
    "Category_Villa",
    "Category_Zweifamilienhaus",
    "model_middle",
    "model_new",
    "model_old"
 ]


const Offer = require('../../models/Offers/Offers-model');
const Buy = require('../../models/Offers/Buy-model');

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
    template[0]=parseFloat(req.body.data.area);
    // Populate Year
    template[1]=parseFloat(req.body.data.room);
    // Populate Year
    template[2]=parseFloat(req.body.data.year);
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.basement)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.fitted_kitchen)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.terrasse)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.equipment)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.city)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.efficiency_class)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.Category)]=1;
    // Populate Year
    template[fields.findIndex((val) => val === req.body.data.model)]=1;

    const val = {"data": [template] }

    const options={
        method:"POST",
        url:"https://76y10jzgmb.execute-api.eu-central-1.amazonaws.com/BIM/",
        headers:{
          Accept:"application/json",
           "Content-Type":"application/x-www-form-urlencoded",
        },
        body:JSON.stringify(val)
      };


      try {
    const prediction_res = await request(options);
    res.status(200).send(prediction_res);
      }catch (error) {
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


// Get all offers  { none => offers }
const getAllOffers = async function (req, res) {
    try {
        const Offers = await Offer.find()
        .populate({
            path:"owner"
        })
        .populate({
            path:"House"
        })
        res.status(200).send(Offers);
    } catch (error) {
        res.status(500).send();
    }
};


const getAllbuyoffers = async function (req, res) {
    try {
        const buy = await Buy.find()
        .populate({
            path:"offer",
            populate: {path : "House", populate:{path:"Lodging"}}
        })
        .populate({
            path:"offer",
            populate: {path : "owner"}
        })




        res.status(200).send(buy);
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
    approveoffer,
    getAllbuyoffers
}
