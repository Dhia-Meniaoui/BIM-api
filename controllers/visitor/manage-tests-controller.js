const Test = require('../../models/test-model');


// Apply for test  { test application => none }
const applyForTest = function (req, res) {
    const test = new Test(req.body);
    test.save().then(() => {
        res.status(200).send()
    }).catch((error) => {
        res.status(400).send(error);
    })
};

module.exports = {applyForTest};