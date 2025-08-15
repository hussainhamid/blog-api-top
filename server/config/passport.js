const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = prisma.user.findUnique({
        where: { id: jwt_payload.user.id },
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log("error in passport.js", err);
      return done(err, false);
    }
  })
);
