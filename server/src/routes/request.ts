const { OAuth2Client } = require("google-auth-library");

export const handleOAuthPostRequest = async (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://localhost:3000/oauth";
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUrl
  );

  const authoriseUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile openid",
    prompt: "consent",
  });

  res.json({ url: authoriseUrl });
};

const getUserData = async (access_token: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(
      access_token
    )}`
  );
  const data = await response.json();
  console.log("data", data);
  return data;
};

export const handleOAuthGetRequest = async (req: any, res: any) => {
  console.log(
    "Oauth send code from google back to server to then retrieve user credentials"
  );
  const code = req.query.code;
  try {
    const redirectUrl = "http://localhost:3000/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const oAuth2ClientRes = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(oAuth2ClientRes.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);

    const data = await getUserData(user.access_token);
    const dataJSON = encodeURIComponent(JSON.stringify(data));
    res.redirect(`http://localhost:8080/loggedin?userData=${dataJSON}`);
  } catch (error: any) {
    console.error("Error with signing in with Google", error);
  }
};
