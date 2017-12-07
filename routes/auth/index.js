const passport = require('passport'),
      controller = require('./auth.controller'),
      authMiddleware = require('../../middlewares/auth')
let router = require('express').Router();

router.route('/auth/local').post(controller.localAuth);

router.route('/auth/facebook').get(passport.authenticate('signin-facebook', {
    authType: "rerequest",
    scope: ['public_profile', 'email']
}))

router.route('/auth/facebook/callback').get(controller.facebookCallback);

router.route('/email/validation/:email').get(controller.emailValidation);

router.route('/auth/signup').post(controller.signup);

router.route('/token').get(controller.tokenRefresh);

router.route('/user/info').get(authMiddleware, controller.getUserInfo);
module.exports = router;