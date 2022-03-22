const express = require('express');

const manageTestApplications = require('../controllers/visitor/manage-tests-controller');
const joinUsController = require('../controllers/visitor/join-us-controller');
const partnerController = require('../controllers/visitor/manage-partner-controller');
const manageMoovobrainOrdersController = require('../controllers/visitor/manageOrdersController');
const manageContactUsController = require('../controllers/visitor/manage-contact-us-controller');
const router = new express.Router();


// Apply for test
router.post('/tests', manageTestApplications.applyForTest);


// Order moovobrain
router.post('/moovobrain' , manageMoovobrainOrdersController.addMoovobrainOrder)

// (Join us) apply for job/internship
router.post('/join-us',
    joinUsController.upload.single('cv'),
    joinUsController.apply,
    joinUsController.applyErrorCatcher);

router.post('/partners',partnerController.applypartenaire);

router.post('/contacts',manageContactUsController.addContactUs);
module.exports = router;
