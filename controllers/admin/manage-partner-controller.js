const path = require('path');

const partner = require('../../models/partenaire');






// Get all partners applications  { admin,authToken, application id => partners application }
const getAllPartners = async (req, res) => {
    try {
        const partners = await partner.find();
        res.status(200).send(partners);
    } catch (error) {
        res.status(500).send();
    }
};

// Delete team member { admin,authToken, team-member's id => none }
const deletePartners = async function (req, res) {
    try {
        const deletedpartner = await partner.findByIdAndDelete(req.params.id);
        deletedpartner ? res.status(200).send() : res.status(404).send();
    } catch (error) {
        res.status(400).send();
    }
}



module.exports = {deletePartners , getAllPartners}