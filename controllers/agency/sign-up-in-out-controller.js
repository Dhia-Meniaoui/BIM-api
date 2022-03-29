const Agency = require('../../models/Users/Agency-model');


// Sign up a new Agency { agency info => agency info ,token }
const signUp = async function (req, res) {
    let agency;
    agency = new Agency(req.body);
    try {
        const token = await agency.generateAuthToken();
        agency.tokens.push({token});
        await agency.save();
        res.status(201).send({agency, token});
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// Sign in a agency  { email,password => agency info,token }
const signIn = async function (req, res) {
    try {
        const agency = await Agency.findByCredentials(req.body.email, req.body.password);
        if (agency.isBanned) {
            throw new Error('This account has been banned')
        }
        const token = await agency.generateAuthToken();
        agency.tokens.push({token});
        await agency.updateOne({tokens: agency.tokens});
        res.status(200).send({agency, token});
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error.toString().replace('Error: ', '')});
    }
};

// Sign out a agency  { agency,authToken => none }
const signOut =  async function (req, res) {
    try {
        let agencyTokens = req.agency.tokens;
        agencyTokens = agencyTokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.agency.updateOne({tokens: agencyTokens});
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = {signUp,signIn,signOut}
