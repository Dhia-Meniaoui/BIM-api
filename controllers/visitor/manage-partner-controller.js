const partner = require('../../models/partenaire');




const applyErrorCatcher = function (error, req, res, next) {
    res.status(400).send({error: error.message});
}



const applypartenaire = async function (req, res) {
    try {
        partner.create({
            name : req.body.name,
            status: req.body.status,
            CEO: {
                nameCEO: req.body.nameCEO,
                email : req.body.email,
                phone : req.body.phone,
                mobile: req.body.mobile
            }
        });
        res.status(200).send();
        
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error.toString()});
    }
};



module.exports = {applyErrorCatcher,applypartenaire};
