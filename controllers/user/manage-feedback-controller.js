const Feedback = require('../../models/Notifications/feedback-model');

// Get feedback  { user,authToken => feedback }
const getFeedback = async function (req, res) {
    try {
        await req.user.populate('feedback').execPopulate();
        console.log(req.user.feedback);
        const feedback = req.user.feedback;
        if (!feedback) {
            return res.status(404).send();
        }
        res.status(200).send(feedback);
    } catch (error) {
        res.status(400).send();
    }
};

// Post a feedback  { user,authToken,feedback => none }
const addFeedback = async function (req, res) {
    const owner = req.user._id
    const feedback = new Feedback({...req.body, owner})
    try {
        await feedback.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
};

/* // Post a feedback  { user,authToken,feedback => none }
const deleteFeedback = async function (req, res) {
    const owner = req.user._id
    const fb = Feedback.findOne(req.feedback.)
    if(req.feedback.)
    try {
        const deleteFeedback = Feedback.findOneAndDelete(req.feedback._id)

    } catch (error) {
        res.status(400).send();
    }
}; */

module.exports = {getFeedback,addFeedback}
