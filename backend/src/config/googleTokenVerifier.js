import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

/**
 * verifyGoogleToken - Verifica um ID token JWT do Google e retorna informações básicas do usuário
 * @param {string} idToken - ID token obtido do cliente (Google Sign-In)
 * @returns {Promise<{googleId:string,name:string,email:string}>}
 */
export async function verifyGoogleToken(idToken) {
  if (!idToken) throw new Error('No token provided');
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.email?.split('@')[0] || 'User';

    if (!email) throw new Error('Google token did not contain an email');

    return { googleId, name, email };
  } catch (err) {
    throw new Error(`Invalid Google token: ${err.message}`);
  }
}
