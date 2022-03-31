const bcrypt = require('bcrypt');
const Agency = require('../../models/Users/Agency-model');

// Delete currently logged account  { agency,authToken => none }
const deleteAccount = async function (req, res) {
    try {
        await req.agency.remove();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
};

// Update currently logged account {agency,authToken,updates => agency}
const updateAccount = async function (req, res) {
    const updatesAllowed = ['name', 'email', 'password', 'oldPassword' , 'phone'];
    const updatesRequested = Object.keys(req.body);
    const isValidUpdate = updatesRequested.every((update) => {
        return updatesAllowed.includes(update);
    });
    if (!isValidUpdate) {
        return res.status(400).send({error: 'invalid update'});
    }

    try {
        // if the password is updated , hash the new password and logout all other sessions by deleting their tokens
        // and preserving the current tokens
        if (req.body.password !==null) {
            // checks if the current password is matching the old password provided
            const isMatch = await bcrypt.compare(req.body.oldPassword,req.agency.password);
            if (!isMatch){
                return res.status(400).send({error: 'wrong password'});
            }
            req.body.password = await bcrypt.hash(req.body.password, 8);
            const currentTokenObject = req.agency.tokens.find((token) => {
                return token.token === req.token
            });
            const tokens = [];
            tokens.push(currentTokenObject);
            req.body.tokens = tokens;
        }else {
            delete req.body.password;
            delete req.body.oldPassword;
        }
        await req.agency.updateOne(req.body, {new: true, runValidators: true});
        const updatedAgency = await Agency.findById(req.agency._id);
        res.status(200).send(updatedAgency);
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
}

module.exports = {deleteAccount, updateAccount};
