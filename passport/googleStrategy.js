const KakaoStrategy = require('passport-google-oauth2').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    // 1
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        callbackURL: '/auth/google/callback',        
    }, async (accessToken, refreshToken, profile, done) => {
        // 2
        try {
            const exUser = await User.find({ where: { snsId: profile.id
                                                    , provider: 'google' }})
            if (exUser) {
                done(null, exUser);
            } else {
                // 3
                const newUser = await User.create({
                    email: profile._json && profile._json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'google',     
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};