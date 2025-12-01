import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_SETTINGS = {
    general: {
        storeName: 'Marc Aromas',
        description: 'Loja de Aromas e Essências',
        logo: null,
        favicon: null,
    },
    branding: {
        primaryColor: '#8B7355',
        secondaryColor: '#5e4e3a',
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        headingFont: 'Inter',
        bodyFont: 'Inter',
    },
    social: {
        instagram: '',
        facebook: '',
        tiktok: '',
        whatsapp: '',
    },
    scripts: {
        googleAnalyticsId: '',
        facebookPixelId: '',
        customHead: '',
        customBody: '',
    },
    cms_home: {
        hero: {
            title: 'Bem-vindo à Marc Aromas',
            subtitle: 'Descubra a essência do bem-estar',
            image: null,
            ctaText: 'Comprar Agora',
            ctaLink: '/loja',
        },
    },
    cms_footer: {
        copyrightText: '© 2024 Marc Aromas. Todos os direitos reservados.',
    },
};

export const getSettings = async (section) => {
    const setting = await prisma.siteSettings.findUnique({
        where: { section },
    });

    if (!setting) {
        return DEFAULT_SETTINGS[section] || {};
    }

    return setting.content;
};

export const updateSettings = async (section, content) => {
    return prisma.siteSettings.upsert({
        where: { section },
        update: { content },
        create: { section, content },
    });
};

export const getPublicSettings = async () => {
    const sections = ['general', 'branding', 'social', 'scripts', 'cms_home', 'cms_footer'];
    const settings = {};

    for (const section of sections) {
        settings[section] = await getSettings(section);
    }

    return settings;
};

export default {
    getSettings,
    updateSettings,
    getPublicSettings,
};
