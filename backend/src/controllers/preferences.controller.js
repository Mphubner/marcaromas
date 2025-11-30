import { prisma } from '../lib/prisma.js';

// GET /api/user/preferences
export const getUserPreferences = async (req, res, next) => {
  try {
    if (req.user) {
      // TODO: implement DB-backed preferences per user
      return res.json({ aromas: ['lavender', 'citrus'], intensity: 'moderate', favorites: [] });
    }
    // Default for unauthenticated users
    res.json({ aromas: [], intensity: '', favorites: [] });
  } catch (error) {
    next(error);
  }
};

// PUT /api/user/preferences - requires auth
export const updateUserPreferences = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const preferences = req.body;
    // TODO: Save preferences to DB for req.user (stubbed)
    // For now echo back
    res.json({ ok: true, preferences });
  } catch (error) {
    next(error);
  }
};
