const Agencie = require('../../models/Users/Agency-model');

// Ban an agency   { admin,authToken,banned agency ID => none }
const banAgencie = async function (req, res) {
    try {
        const bannedID = req.params.id;
        const agency = await Agencie.findById(bannedID);
        if (!agency) {
            return res.status(404).send()
        }
        await agency.update({isBanned: true, tokens: []});
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
};



module.exports = {banAgencie};