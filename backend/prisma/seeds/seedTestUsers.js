import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script simples para criar usuários de teste
 */

const testUsers = [
    { name: 'Maria Silva', email: 'maria.silva@email.com' },
    { name: 'João Santos', email: 'joao.santos@email.com' },
    { name: 'Ana Costa', email: 'ana.costa@email.com' },
    { name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com' },
    { name: 'Carla Rodrigues', email: 'carla.rodrigues@email.com' },
    { name: 'Lucas Ferreira', email: 'lucas.ferreira@email.com' },
    { name: 'Juliana Souza', email: 'juliana.souza@email.com' },
    { name: 'Rafael Lima', email: 'rafael.lima@email.com' },
    { name: 'Fernanda Alves', email: 'fernanda.alves@email.com' },
    { name: 'Bruno Martins', email: 'bruno.martins@email.com' },
    { name: 'Camila Pereira', email: 'camila.pereira@email.com' },
    { name: 'Diego Rocha', email: 'diego.rocha@email.com' },
    { name: 'Patricia Lopes', email: 'patricia.lopes@email.com' },
    { name: 'Rodrigo Dias', email: 'rodrigo.dias@email.com' },
    { name: 'Amanda Ribeiro', email: 'amanda.ribeiro@email.com' },
    { name: 'Marcos Cardoso', email: 'marcos.cardoso@email.com' },
    { name: 'Renata Barbosa', email: 'renata.barbosa@email.com' },
    { name: 'Gustavo Pinto', email: 'gustavo.pinto@email.com' },
    { name: 'Beatriz Teixeira', email: 'beatriz.teixeira@email.com' },
    { name: 'Thiago Gomes', email: 'thiago.gomes@email.com' }
];

async function main() {
    console.log('👥 Criando usuários de teste...\n');

    let created = 0;
    let skipped = 0;

    for (const userData of testUsers) {
        try {
            // Verificar se já existe
            const existing = await prisma.user.findUnique({
                where: { email: userData.email }
            });

            if (existing) {
                console.log(`  ⏭️  ${userData.name} (${userData.email}) já existe`);
                skipped++;
                continue;
            }

            // Criar usuário
            const user = await prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    password: 'hashed_password_placeholder', // Senha fictícia
                    role: 'customer'
                }
            });

            console.log(`  ✅ ${user.name} (${user.email}) criado`);
            created++;

        } catch (error) {
            console.error(`  ❌ Erro ao criar ${userData.name}:`, error.message);
        }
    }

    const totalUsers = await prisma.user.count();

    console.log(`\n✅ Seed de usuários completado!`);
    console.log(`📊 ${created} novos usuários criados`);
    console.log(`⏭️  ${skipped} usuários já existiam`);
    console.log(`👥 Total de usuários no sistema: ${totalUsers}\n`);
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
