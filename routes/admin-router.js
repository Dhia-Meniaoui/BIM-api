const express = require('express');

const authAdmin = require('../middleware/authentication').authAdmin;
const signController = require('../controllers/admin/sign-up-login-logout-controller');
const manageAdminAccountController = require('../controllers/admin/manage-admin-account-controller');
const UsersManagementController = require('../controllers/admin/manage-users-controller');
const AgenciesManagementController = require('../controllers/admin/manage-agencies-controller');
const manageJoinUsController = require('../controllers/admin/manage-join-us-controller');
const manageArticlesController = require('../controllers/admin/manage-articles-controller');
const manageTeamMembersController = require('../controllers/admin/manage-team-members-controller');
const manageOffersController = require('../controllers/admin/manage-offers-controller');
const manageContactUsController = require('../controllers/visitor/manage-contact-us-controller');

const router = new express.Router();

/* =============================
    Admin sign-up-in-out
   =============================*/
// # this request will be executed only one time before production to create the admin

// Sign up an Admin
router.post('/admin', signController.signUp);

// Sign in Admin
router.post('/admin/login', signController.signIn);

// Sign out admin
router.post('/admin/logout', authAdmin, signController.signOut);

/* =============================
    Manage admin account
   =============================*/

// Update admin Account
router.patch('/admin', authAdmin, manageAdminAccountController.updateAccount);

/* =============================
    Manage users 
   =============================*/

// Ban a user
router.post('/Users/ban/:id', authAdmin, UsersManagementController.banUser);

/* // delete a user
router.delete('/Users/delete/:id', authAdmin, UsersManagementController.deleteUser);
 */
/* =============================
    Manage agency 
   =============================*/

// Ban an agency
router.post('/Agencies/ban/:id', authAdmin, AgenciesManagementController.banAgencie);

/* // delete an agency
router.delete('/agencies/delete/:id', authAdmin, AgenciesManagementController.deleteAgencie);

// turn an agency to a partner
router.patch('/agencies/partner/:id', authAdmin, AgenciesManagementController.partnerAgencie);
 */

/* =============================
    Manage joins-us applications
   =============================*/

// Get a cv PDF file
router.get('/join-us/cv/:id', authAdmin, manageJoinUsController.getCvPdfFile);

// Get all join-us applications
router.get('/join-us/all',  authAdmin, manageJoinUsController.getAllApplications);

// Get a join-us application
router.get('/join-us/:id', authAdmin, manageJoinUsController.getOneApplication);






/* =============================
    Manage Articles
   =============================*/

// Add a new article  { admin,authToken, article => none }
router.post('/articles',
    authAdmin,
    manageArticlesController.uploadImage.single('image'),
    manageArticlesController.addArticle,
    manageArticlesController.addArticleErrorCatcher
);


// Get many articles
// /articles  => get all articles
// /articles?limit=X  => get the first X articles
// /articles?limit=X&skip=Y  => skip Y articles then get X articles
router.get('/articles', manageArticlesController.getManyArticles);

// Get one article
router.get('/articles/:id', manageArticlesController.getOneArticle);

// Update Article
router.patch('/articles/:id',
    authAdmin,
    manageArticlesController.uploadImage.single('image'),
    manageArticlesController.updateArticle,
    manageArticlesController.addArticleErrorCatcher);

// Delete an article
router.delete('/articles/:id', authAdmin, manageArticlesController.deleteArticle);


/* =============================
    Manage team Members
   =============================*/

// add a team member
router.post('/members',
    authAdmin,
    manageTeamMembersController.uploadImage.single('image'),
    manageTeamMembersController.addTeamMember,
    manageTeamMembersController.addTeamMemberErrorCatcher);

// Get all team members
router.get('/members/all', manageTeamMembersController.getAllTeamMembers);
// Get a team member
router.get('/members/:id', authAdmin, manageTeamMembersController.getTeamMember);

// Update a team member
router.patch('/members/:id',
    authAdmin,
    manageTeamMembersController.uploadImage.single('image'),
    manageTeamMembersController.updateTeamMember,
    manageTeamMembersController.addTeamMemberErrorCatcher);

// delete a team member
router.delete('/members/:id', authAdmin, manageTeamMembersController.deleteTeamMember);

/* =============================
    Manage prediction
   =============================*/

/* // get an offer prediction 
router.get('/predictions/:id', authAdmin, manageoffersprediction.getpredictionRequests);

// set a prediction request to the lambda function AWS
router.post('/prediction/offer/:id', authAdmin, manageoffersprediction.postpredictionRequests);
 */

/* =============================
    Manage contact us messages
   =============================*/

// get all contact us messages
router.get('/contacts', authAdmin, manageContactUsController.getAllContactUs);

// delete a contact us message
router.delete('/contacts/:id', authAdmin, manageContactUsController.deleteContactUsMessage);

/* =============================
    Manage offers
   =============================*/

// Get all the offers 
router.get('/offers', authAdmin, manageOffersController.getAllOffers);

// Get an offer 
router.get('/offer/details/:id', authAdmin, manageOffersController.getOneOffer);

// Delete an offer 
router.delete('/offer/:id', authAdmin, manageOffersController.deleteOffer);

// Add an offer request
router.post('/offer', authAdmin, manageOffersController.addOffer);

module.exports = router;
