const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const user = require("./models/User");
const jwtStrategy = require("passport-jwt").Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

//authorization
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretKey: "VinitVerma",
    },
    (payload, done) => {
      user.findById({ _id: payload.sub }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
      });
    }
  )
);

//Authenticated local strategy using username and password.
passport.use(
  new localStrategy((userName, password, done) => {
    user.findOne({ userName }, (err) => {
      //Some error occurs.
      if (err) return done(err);
      //If no user exits.
      if (!user) return done(null, false);
      //Check if password is correct.
      user.comparePassword(password, done);
    });
  })
);
