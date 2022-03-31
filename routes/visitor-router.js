const express = require('express');


const joinUsController = require('../controllers/visitor/join-us-controller');
const manageContactUsController = require('../controllers/visitor/manage-contact-us-controller');
const router = new express.Router();


// (Join us) apply for job/internship
router.post('/join-us',
    joinUsController.upload.single('cv'),
    joinUsController.apply,
    joinUsController.applyErrorCatcher);



router.post('/contacts',manageContactUsController.addContactUs);

module.exports = router;
