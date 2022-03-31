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


module.exports = {getFeedback}
