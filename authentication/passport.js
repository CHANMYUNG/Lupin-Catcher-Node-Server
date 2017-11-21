let passport = require('passport');
let FacebookStrategy = require('passport-facebook').Strategy;
let LocalStrategy = require('passport-local').Strategy;
const User = require('../database/models/user');
module.exports = () => {
    passport.serializeUser(function (user, done) {
        console.log("SERIALIZED" + user)
        done(null, user);
    })

    passport.deserializeUser(function (_id, done) {
        console.log("DESERIALIZED :" + _id);
        User.findById(_id)
            .then(user => {
                if (!user) done(new Error('ERROR'));
                else done(null, user);
            })
    });

    passport.use('signin-local', new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true,
        passReqToCallback: true
    }, (req, email, password, done) => {
        User.findOneByEmail(email)
            .then(user => {
                if (!user) {
                    req.session.destroy();
                    done(null, false);
                } else if (user.verifyPassword(password)) {
                    done(null, user._id)
                } else done(null, false);
            })
            .catch(err => {
                console.log(err);
                req.session.destroy();
                done(err);
            })
    }))

    passport.use('signin-facebook', new FacebookStrategy({
        clientID: process.env.FB_CLIENT_ID || '861287134034172',
        clientSecret: process.env.FB_CLIENT_SECRET || '20162dfb277128f4921cabe594f0fa7e',
        callbackURL: '/auth/facebook/callback',
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        console.log("!@#@#");
        console.log(profile);
        console.log(refreshToken);
        User.findOne({
                id: profile.id,
                auth: "facebook"
            })
            .then(user => {
                if (!user) {
                    new User({
                            "id": profile.id,
                            "auth": "facebook"
                        }).save()
                        .then(user => {
                            done(null, user._id);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } else done(null, user._id)
            })
            .catch(err => {
                done(err);
            })
    }))


}