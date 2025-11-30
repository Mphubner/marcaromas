import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(){
  const email = process.argv[2] || 'mpereirah15@gmail.com';
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user);
  await prisma.$disconnect();
}

main().catch(err=>{ console.error(err); process.exit(1); });
