const Client = require('../../models/client-model');


// Sign up a new Client { client info => client info ,token }
const signUp = async function (req, res) {
    let client;
    client = new Client(req.body);
    try {
        const token = await client.generateAuthToken();
        client.tokens.push({token});
        await client.save();
        res.status(201).send({client, token});
    } catch (error) {
        res.status(400).send({error: error.toString()});
    }
};

// Sign in a client  { email,password => client info,token }
const signIn = async function (req, res) {
    try {
        const client = await Client.findByCredentials(req.body.email, req.body.password);
        if (client.isBanned) {
            throw new Error('This account has been banned')
        }
        const token = await client.generateAuthToken();
        client.tokens.push({token});
        await client.updateOne({tokens: client.tokens});
        res.status(200).send({client, token});
    } catch (error) {
        console.log(error)
        res.status(400).send({error: error.toString().replace('Error: ', '')});
    }
};

// Sign out a client  { client,authToken => none }
const signOut =  async function (req, res) {
    try {
        let clientTokens = req.client.tokens;
        clientTokens = clientTokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.client.updateOne({tokens: clientTokens});
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = {signUp,signIn,signOut}
