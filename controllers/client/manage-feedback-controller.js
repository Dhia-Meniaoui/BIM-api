const Feedback = require('../../models/feedback-model');

// Get feedback  { client,authToken => feedback }
const getFeedback = async function (req, res) {
    try {
        await req.client.populate('feedback').execPopulate();
        console.log(req.client.feedback);
        const feedback = req.client.feedback;
        if (!feedback) {
            return res.status(404).send();
        }
        res.status(200).send(feedback);
    } catch (error) {
        res.status(400).send();
    }
};

// Post a feedback  { client,authToken,feedback => none }
const addFeedback = async function (req, res) {
    const owner = req.client._id
    const feedback = new Feedback({...req.body, owner})
    try {
        await feedback.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
};

module.exports = {getFeedback,addFeedback}
