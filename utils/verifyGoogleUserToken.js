const { OAuth2Client } = require('google-auth-library');
const  clientId = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(clientId);

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });
  const payload = ticket.getPayload();
  return payload;
}
module.exports = {verifyGoogleToken}