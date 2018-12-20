const router = require("express").Router();
const { User } = require("./db");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
module.exports = router;

//google authentication and login (GET /auth/google)
router.get("/", passport.authenticate("google", { scope: "email" }));

//handles the callback after google has authenticated the user (GET /auth/google/callback)
router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/home",
    failureRedirect: "/"
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "911832928736-cdmpuc3if8o4l72jbia002apbu80njsk.apps.googleusercontent.com",
      clientSecret: "ifjPr8NlSo6UsjcEIkfwkEFH",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    //google sends back the token and profile
    (token, refreshToken, profile, done) => {
      const info = {
        email: profile.emails[0].value,
        imageUrl: profile.photos ? profile.photos[0].value : undefined
      };

      User.findOrCreate({
        where: { googleId: profile.id },
        defaults: info
      })
        .spread(user => {
          done(null, user);
        })
        .catch(done);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
