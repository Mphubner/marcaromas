import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Aplicando migration manualmente...\n');

    const migrationPath = path.join(__dirname, 'prisma/migrations/20251126215753_enhance_orders_management/migration.sql');

    console.log(`📄 Lendo SQL de: ${migrationPath}\n`);

    const fullSql = fs.readFileSync(migrationPath, 'utf-8');

    // Dividir em statements individuais (separados por ;)  
    const statements = fullSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('/*') && s !== '--');

    console.log(`📝 Encontrados ${statements.length} statements SQL\n`);

    let executed = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim() + ';';

        // Skip comments
        if (statement.startsWith('--') || statement.startsWith('/*')) {
            continue;
        }

        const preview = statement.substring(0, 80).replace(/\n/g, ' ');

        try {
            await prisma.$executeRawUnsafe(statement);
            console.log(`  ✅ [${i + 1}/${statements.length}] ${preview}...`);
            executed++;
        } catch (error) {
            // Se o erro é "column already exists" ou "table already exists", skip silenciosamente
            if (error.message.includes('already exists') || error.message.includes('duplicate')) {
                console.log(`  ⏭️  [${i + 1}/${statements.length}] ${preview}... (já existe)`);
                skipped++;
            } else {
                console.error(`  ❌ [${i + 1}/${statements.length}] ${preview}...`);
                console.error(`     Erro: ${error.message}`);
                failed++;
            }
        }
    }

    console.log(`\n📊 Resumo:`);
    console.log(`   ✅ Executados: ${executed}`);
    console.log(`   ⏭️  Pulados: ${skipped}`);
    console.log(`   ❌ Falhados: ${failed}`);

    if (failed === 0) {
        console.log(`\n✅ Migration aplicada com sucesso!`);
        console.log(`\n💡 Próximos passos:`);
        console.log(`   1. npx prisma generate`);
        console.log(`   2. node prisma/seeds/seedOrders.js\n`);
    } else {
        console.log(`\n⚠️  Alguns statements falharam. Revise os erros acima.\n`);
    }
}

main()
    .catch((e) => {
        console.error('\n❌ Erro fatal:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
