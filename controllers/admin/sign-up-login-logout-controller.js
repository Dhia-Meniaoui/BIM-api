const Admin = require('../../models/admin-model');


// Sign up an Admin { admin info => admin info ,token }
const signUp = async function (req, res) {
    const admin = new Admin(req.body);
    try {
        const token = await admin.generateAuthToken();
        admin.tokens.push({token});
        await admin.save();
        res.status(201).send({admin, token});
    } catch (error) {
        res.status(400).send();
    }
};

// Sign in Admin { email,password => admin info,token }
const signIn = async function (req, res)  {
    console.log(req.body.email);
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        admin.tokens.push({token});
        await admin.updateOne({tokens: admin.tokens});
        res.status(200).send({admin, token});
        console.log('dhia');
    } catch (error) {
        res.status(400).send({error: 'Unable to login'});
    }
};

// Sign out admin  { admin,authToken => none }
const signOut =  async function (req, res) {
    try {
        let adminTokens = req.admin.tokens;
        adminTokens = adminTokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.admin.updateOne({tokens: adminTokens});
        res.send(); // same as res.status(200).send()
    } catch (error) {
        res.status(500).send();
    }
};

module.exports = {signUp,signIn,signOut} ;