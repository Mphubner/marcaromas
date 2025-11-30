import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(){
  const email = process.argv[2];
  const raw = process.argv[3] || 'password';
  if (!email) {
    console.error('Usage: node setAdminPassword.mjs <email> [password]');
    process.exit(1);
  }
  const hash = await bcrypt.hash(raw, 10);
  const u = await prisma.user.update({ where: { email }, data: { password: hash, isAdmin: true } });
  console.log('Updated user:', { id: u.id, email: u.email, isAdmin: u.isAdmin });
  await prisma.$disconnect();
}

main().catch(err=>{ console.error(err); process.exit(1); });
