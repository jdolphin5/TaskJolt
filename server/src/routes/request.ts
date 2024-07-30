const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      console.log("profile", profile);

      const userEmail = profile.emails[0].value;

      // Check if user already exists in our db
      const existingUser = await prisma.users.findUnique({
        where: {
          google_sub: profile.id,
        },
      });

      console.log("Found user:", existingUser);

      if (existingUser) {
        // User already exists
        //add email to user object (email can change according to google)
        existingUser.email = userEmail;
        return done(null, existingUser);
      }

      // If not, create a new user
      const newUser = await prisma.users.create({
        data: {
          is_google_oauth2: 1,
          google_sub: profile.id,
          last_login_date_time: new Date().toISOString(),
          created_date_time: new Date().toISOString(),
          type: "super",
        },
      });

      //add email to user object (email can change according to google)
      newUser.email = userEmail;
      console.log("Created user:", newUser);

      return done(null, newUser);
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(async (user: any, done: any) => {
  done(null, user);
});

export { passport };
