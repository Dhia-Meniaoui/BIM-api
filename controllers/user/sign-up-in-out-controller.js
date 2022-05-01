const User = require('../../models/Users/User-model');


// Sign up a new User { User info => User info ,token }
const signUp = async function (req, res) {
    let user;
    user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        user.tokens.push({token});
        await user.save();
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// Sign in a user  { username,password => user info,token }
const signIn = async function (req, res) {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        if (user.isBanned) {
            throw new Error('This account has been banned')
        }
        const token = await user.generateAuthToken();
        user.tokens.push({token});
        await user.updateOne({tokens: user.tokens});
        res.status(200).send({user, token});
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error.toString().replace('Error: ', '')});
    }
};

// Sign out a user  { user,authToken => none }
const signOut =  async function (req, res) {
    try {
        let userTokens = req.user.tokens;
        userTokens = userTokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.updateOne({tokens: userTokens});
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = {signUp,signIn,signOut}
