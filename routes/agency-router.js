const express = require('express');

const authAgency = require('../middleware/authentication').authAgency;
const signController = require('../controllers/agency/sign-up-in-out-controller');
const manageAccountController = require('../controllers/agency/manage-account-controller');
const manageFeedbackController = require('../controllers/agency/manage-feedback-controller');
const manageOffersController = require('../controllers/agency/manage-offers-controller');

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
router.patch('/offers/:id', authAgency, manageOffersController.updateOffer);

// Add an offer request
router.post('/offer', authAgency, manageOffersController.addOffer);

// Get all the offers 
router.get('/offers', authAgency, manageOffersController.getAllOffers);

// Get an offer 
router.get('/offer/details/:id', authAgency, manageOffersController.getOneOffer);

// Delete an offer 
router.delete('/offer/:id', authAgency, manageOffersController.deleteOffer);


/* =============================
    partner request 
   =============================*/

/* router.post('/partner',partnerController.applypartenaire);
 */
module.exports = router;
