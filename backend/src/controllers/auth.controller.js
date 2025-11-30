import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../config/googleTokenVerifier.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email já cadastrado" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hash } });
    const token = jwt.sign({ userId: user.id, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
    // If user has no local password (e.g. created via Google), reject local login
    if (!user.password) return res.status(401).json({ error: "Credenciais inválidas" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
    const token = jwt.sign({ userId: user.id, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    next(err);
  }
}

export async function googleTokenExchange(req, res, next) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify the Google ID token
    const googleData = await verifyGoogleToken(token);
    const { googleId, name, email } = googleData;

    const adminEmails = [
      "jademoraes.ejcad@gmail.com",
      "mpereirah15@gmail.com",
      "clientmarcaromas@gmail.com",
    ];
    const isAdmin = adminEmails.includes(email);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: name || "User",
          email,
          googleId,
          googleEmail: email,
          isAdmin, // Set admin status on creation
        },
      });
    } else {
      // Link Google account to existing user and ensure admin status
      user = await prisma.user.update({
        where: { email },
        data: {
          googleId,
          googleEmail: email,
          isAdmin, // Ensure admin status is updated
        },
      });
    }

    const jwtToken = jwt.sign({ userId: user.id, isAdmin: !!user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      token: jwtToken,
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(401).json({ error: err.message || "Google authentication failed" });
  }
}

export async function googleCallback(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Google authentication failed" });
    }

    const user = req.user;
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?token=${token}&userId=${user.id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    // authMiddleware já preencheu req.user
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const userId = req.user.id;

    // Get user's active subscriptions
    const activeSubs = await prisma.subscription.findMany({
      where: {
        userId: userId,
        status: 'ACTIVE'
      },
      select: { planId: true }
    });

    // Add active_plan_ids to user object
    const { password, ...userWithoutPassword } = req.user;
    const userWithPlans = {
      ...userWithoutPassword,
      active_plan_ids: activeSubs.map(sub => sub.planId)
    };

    res.json({ user: userWithPlans });
  } catch (err) {
    next(err);
  }
}
