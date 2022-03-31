const User = require('../../models/Users/User-model');

// Ban a user  { admin,authToken,banned user ID => none }
const banUser = async function (req, res) {
    try {
        const bannedID = req.params.id;
        const user = await User.findById(bannedID);
        if (!user) {
            return res.status(404).send()
        }
        await user.update({isBanned: true, tokens: []});
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
};



module.exports = {banUser};