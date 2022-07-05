const express = require('express');

const authUser = require('../middleware/authentication').authUser;
const signController = require('../controllers/user/sign-up-in-out-controller');
const manageAccountController = require('../controllers/user/manage-account-controller');
const manageFeedbackController = require('../controllers/user/manage-feedback-controller');
const manageOffersController = require('../controllers/user/manage-offers-controller');

const router = new express.Router();


/* =============================
    user sign-up-in-out
   =============================*/

// Sign in a user
router.post('/users/login', signController.signIn);

// Sign up a new user
router.post('/users', signController.signUp);

// Sign out a user
router.post('/users/logout', signController.signOut);


/* ============================= 
    Manage account
   =============================*/ 

// Delete currently logged account
router.delete('/users', authUser, manageAccountController.deleteAccount);

// Update currently logged account
router.put('/users', authUser, manageAccountController.updateAccount);

/* =============================
    Manage feedback
   =============================*/

// Post a feedback
router.post('/feedback', authUser, manageFeedbackController.addFeedback);

/* // Delete a feedback
router.delete('/feedback/:id', authUser, manageFeedbackController.deleteFeedback);
 */
// get a feedback
router.get('/feedback/:id', authUser, manageFeedbackController.getFeedback);

/* =============================
    Manage offers
   =============================*/

// share an offer and update the 
router.post('/offers/share', authUser, manageOffersController.shareoffer);

// Add an offer request
router.post('/offer', authUser, manageOffersController.addOffer);

// Get all the offers 
router.get('/offers',  manageOffersController.getAllOffers);

// Get an offer 
router.get('/offer/details/:id', authUser, manageOffersController.getOneOffer);

// Delete an offer 
router.delete('/offer/:id', authUser, manageOffersController.deleteOffer);




module.exports = router;
