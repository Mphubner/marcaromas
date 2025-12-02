import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { prisma } from '../lib/prisma.js';
import logger from '../utils/logger.js';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK = process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/google/callback`;

console.log('[Google Auth] Callback URL configured as:', GOOGLE_CALLBACK);

// If environment variables are missing, still configure strategy but warn.
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  logger.warn('[Google OAuth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth will not work.');
  console.warn('[googleAuth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth may fail.');
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK,
},
  async function (accessToken, refreshToken, profile, done) {
    try {
      // profile contains id, displayName and emails
      const googleId = profile.id;
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      const name = profile.displayName || (email ? email.split('@')[0] : 'User');

      if (!email) {
        logger.error('[Google OAuth] No email associated with Google account', { googleId });
        return done(new Error('Nenhum email associado à conta Google. Por favor, verifique as permissões.'));
      }

      logger.info('[Google OAuth] User attempting login', { email, googleId });

      // Try to find user by email
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Create user
        user = await prisma.user.create({ data: { name, email, googleId, googleEmail: email } });
        logger.info('[Google OAuth] New user created', { userId: user.id, email });
      } else if (!user.googleId) {
        // Link existing user
        user = await prisma.user.update({ where: { email }, data: { googleId, googleEmail: email } });
        logger.info('[Google OAuth] Existing user linked to Google', { userId: user.id, email });
      } else {
        logger.info('[Google OAuth] User logged in', { userId: user.id, email });
      }

      // Return minimal user object for req.user
      return done(null, { id: user.id, name: user.name, email: user.email });
    } catch (err) {
      logger.error('[Google OAuth] Authentication error', {
        error: err.message,
        stack: err.stack,
        googleId: profile?.id
      });
      return done(new Error('Erro ao autenticar com Google. Por favor, tente novamente.'));
    }
  }
));

export default passport;
