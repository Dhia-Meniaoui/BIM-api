const express = require('express');

const authClient = require('../middleware/authentication').authClient;
const signController = require('../controllers/client/sign-up-in-out-controller');
const manageAccountController = require('../controllers/client/manage-account-controller');
const manageFeedbackController = require('../controllers/client/manage-feedback-controller');
const manageServicesController = require('../controllers/client/manage-services-controller');

const router = new express.Router();


/* =============================
    Client sign-up-in-out
   =============================*/

// Sign in a client
router.post('/clients/login', signController.signIn);

// Sign up a new Client
router.post('/clients', signController.signUp);

// Sign out a client
router.post('/clients/logout', authClient, signController.signOut);


/* =============================
    Manage account
   =============================*/

// Delete currently logged account
router.delete('/clients', authClient, manageAccountController.deleteAccount);

// Update currently logged account
router.put('/clients', authClient, manageAccountController.updateAccount);

/* =============================
    Manage feedback
   =============================*/

// Post a feedback
router.post('/feedback', authClient, manageFeedbackController.addFeedback);

// Get a feedback
router.get('/feedback', authClient, manageFeedbackController.getFeedback);

/* =============================
    Manage services
   =============================*/

// Get a maintenance request
router.post('/services/maintenance', authClient, manageServicesController.addMaintenanceRequest);

// add quarterly control years
router.post('/services/control', authClient, manageServicesController.addQualityControlYears);

// Get scheduled quality controls for the next period for the logged client
router.get('/services/control', authClient, manageServicesController.getQualityControlsByClient);

// Add a training session request
router.post('/services/training', authClient, manageServicesController.addTrainingSessionRequest);


module.exports = router;
