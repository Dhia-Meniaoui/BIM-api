const express = require('express');

const authAgency = require('../middleware/authentication').authAgency;
const signController = require('../controllers/user/sign-up-in-out-controller');
const manageAccountController = require('../controllers/user/manage-account-controller');
const manageFeedbackController = require('../controllers/user/manage-feedback-controller');
const manageServicesController = require('../controllers/user/manage-offers-controller');

const router = new express.Router();


/* =============================
    agency sign-up-in-out
   =============================*/

// Sign in a agency
router.post('/agencies/login', signController.signIn);

// Sign up a new agency
router.post('/agencies', signController.signUp);

// Sign out a agency
router.post('/agencies/logout', authAgency, signController.signOut);


/* =============================
    Manage account
   =============================*/

// Delete currently logged account
router.delete('/agencies', authAgency, manageAccountController.deleteAccount);

// Update currently logged account
router.put('/agencies', authAgency, manageAccountController.updateAccount);

/* =============================
    Manage feedback
   =============================*/

// get a feedback
router.get('/feedback', authAgency, manageFeedbackController.getFeedback);


/* =============================
    Manage offers
   =============================*/

// update an offer request
router.patch('/offers/:id', authAgency, manageOffersController.updateOfferRequest);

// Add an offer request
router.post('/offer', authAgency, manageOffersController.addOfferRequest);

// Get all the offers 
router.get('/offers', authAgency, manageOffersController.getOffersRequest);

// Get an offer 
router.get('/offer/details/:id', authAgency, manageOffersController.getOfferRequest);


/* =============================
    partner request 
   =============================*/

router.post('/partner',partnerController.applypartenaire);

module.exports = router;
