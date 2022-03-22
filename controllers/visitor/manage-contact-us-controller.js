const ContactUs = require('../../models/contact-us-model');

// add a contact us form  { contact us body => none }
const addContactUs = async function (req, res) {
    try {
        const contactUs = new ContactUs(req.body);
        await contactUs.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send();
    }
}

// get all contact us messages { admin , authToken => all contact us messages }
const getAllContactUs = async function (req, res) {
    try {
        const contactUs = await ContactUs.find({}).sort({createdAt: 'desc'});
        res.status(200).send(contactUs);
    } catch (e) {
        res.status(400).send();
    }
}

// delete a contact us message { admin , authToken => none }
const deleteContactUsMessage = async function (req, res) {
    try{
        const deletedMessage = await ContactUs.findByIdAndDelete(req.params.id);
        deletedMessage ? res.status(200).send() : res.status(404).send();
    }catch (error) {
        res.status(400).send();
    }
}

module.exports = {addContactUs, getAllContactUs , deleteContactUsMessage};