const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

//console.log(process.env.CLIENT_ID);

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
      console.log(accessToken);

      // Check if user already exists in our db
      const existingUser = await prisma.users.findUnique({
        where: {
          google_sub: accessToken,
        },
      });
      console.log("Found user:", existingUser);

      if (existingUser) {
        // User already exists
        return done(null, existingUser);
      }

      // If not, create a new user
      const newUser = await prisma.users.create({
        data: {
          email: "user@example.com",
          is_google_oauth2: 1,
          google_sub: accessToken,
          last_login_date_time: new Date().toISOString(),
          created_date_time: new Date().toISOString(),
          type: "super",
        },
      });

      console.log("Created user:", newUser);

      return done(null, newUser);

      //return done(null, profile);
    }
  )
);
/*
  id                   Int          @id @unique(map: "id_UNIQUE") @default(autoincrement()) @db.SmallInt
  email                String?       @db.Text
  is_google_oauth2     Int          @db.SmallInt
  google_sub           String?      @db.Text
  password             String?      @db.Text
  last_login_date_time DateTime?    @db.DateTime(0)
  created_date_time    DateTime     @db.DateTime(0)
  type                 String       @db.Text
  task_users           task_users[] @ignore
*/

// Serialize user ID into the session
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(async (user: any, done: any) => {
  /*
  const user = await prisma.users.findUnique({
    where: {
      google_sub: id,
    },
  });
  done(null, user);
  */
  done(null, user);
});

export { passport };
