const passport = require("passport");
const LocalStratrgy = require("passport-local").Strategy;
const { comparePrevPassword } = require("../api/util");
const { json } = require("express");

// Serialize the User
passport.serializeUser(async (user, cb) => {
  const _user = await sails.helpers.jwt.generateToken.with({ user });

  cb(null, _user);
});

// Deserialize the User
passport.deserializeUser(async (user, cb) => {
  try {
    return cb(undefined, await User.getOne({ id: user.id }));
  } catch (e) {
    return cb(e, null);
  }
});

// Local
passport.use(
  new LocalStratrgy(
    {
      usernameField: "email",
      passportField: "password",
    },
    async (email, password, cb) => {
      try {
        
        const user = await User.findOne({email});
        if (!user) {
          return cb(null, false, { message: "Invalid email or password." });
        }
        if (!user.password) {
          return cb(null, false, { message: "Invalid email or password." });
        }

        const res = await comparePrevPassword(password, user.password);
        if (!res) {
          return cb(null, false, { message: "Invalid email or password." });
        }
        // if (user.is_active == false) {
        //   return cb(null, false, { message: "Your account is inactive." });
        // }

        return cb(null, user, { message: "Login Successful" });
      } catch (err) {
        if (err) {
          return cb(err);
        }
      }
    }
  )
);
