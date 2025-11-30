import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDefaultReferralProgram() {
    try {
        // Check if program already exists
        const existing = await prisma.referralProgram.findFirst({
            where: { is_active: true }
        });

        if (existing) {
            console.log('✅ Active referral program already exists:', existing.name);
            return;
        }

        // Create default program
        const program = await prisma.referralProgram.create({
            data: {
                name: 'Programa Padrão 2024',
                type: 'FIXED',
                is_active: true,
                fixed_amount: 10.00, // R$ 10 por indicação
                trigger_event: 'FIRST_PURCHASE',
                min_purchase_amount: 50.00,
                is_recurring: false
            }
        });

        console.log('✅ Default referral program created successfully!');
        console.log('Program ID:', program.id);
        console.log('Name:', program.name);
        console.log('Type:', program.type);
        console.log('Reward:', `R$ ${program.fixed_amount}`);
        console.log('Trigger:', program.trigger_event);

    } catch (error) {
        console.error('Error creating default referral program:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createDefaultReferralProgram();
