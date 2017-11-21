const passport = require('passport');
const controller = require('./auth.controller');
let router = require('express').Router();

router.route('/auth/local').post(controller.localAuth);

router.route('/auth/facebook').get(passport.authenticate('signin-facebook', {
    authType: "rerequest",
    scope: ['public_profile', 'email']
}))

router.route('/auth/facebook/callback').get(controller.facebookCallback);

router.route('/email/validation/:email').get(controller.emailValidation);

router.route('/auth/signup').post(controller.signup);

module.exports = router;