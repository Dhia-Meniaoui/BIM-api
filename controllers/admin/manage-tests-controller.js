const Test = require('../../models/test-model');

// Validate test  { admin,authToken,test ID => none }
const validateTest = async function (req, res)  {
    try {
        const testID = req.params.id;
        const test = await Test.findById(testID);
        if (!test) {
            return res.status(404).send()
        }
        await test.update({isValidated: true});
        // send email to the tester
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
};

module.exports = {validateTest};