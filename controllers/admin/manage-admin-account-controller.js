const bcrypt = require('bcrypt');
const Admin = require('../../models/admin-model');

// Update admin account { admin,authToken, updates body => updated admin }
const updateAccount = async function (req, res) {
    const updatesAllowed = ['name', 'email', 'password'];
    const updatesRequested = Object.keys(req.body);
    const isValidUpdated = updatesRequested.every((update) => {
        return updatesAllowed.includes(update);
    });
    if (!isValidUpdated) {
        return res.status(400).send({error: 'update is not valid'});
    }
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
            const currentTokenObject = req.admin.tokens.find((token) => {
                return token.token === req.token
            });
            const tokens = new Array();
            tokens.push(currentTokenObject);
            req.body.tokens = tokens;
        }
        await req.admin.updateOne(req.body, {new: true, runValidators: true});
        const updatedAdmin = await Admin.findById(req.admin._id);
        res.status(200).send(updatedAdmin);
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
}

module.exports = {updateAccount};