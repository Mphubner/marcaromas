import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email já cadastrado" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hash } });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
}
