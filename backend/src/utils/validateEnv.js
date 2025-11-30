/**
 * Environment Variables Validation
 * Validates required environment variables on server startup
 */

const requiredVars = {
    critical: [
        'DATABASE_URL',
        'JWT_SECRET',
    ],
    payment: [
        'MERCADOPAGO_ACCESS_TOKEN', // Default fallback
    ],
    optional: [
        'MERCADOPAGO_ACCESS_TOKEN_SUBS',
        'MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'MELHOR_ENVIO_TOKEN',
    ]
};

export function validateEnvironment() {
    const missing = {
        critical: [],
        payment: [],
        optional: []
    };

    // Check critical variables
    requiredVars.critical.forEach(varName => {
        if (!process.env[varName]) {
            missing.critical.push(varName);
        }
    });

    // Check payment variables (needs at least one MP token)
    const hasAnyMpToken = !!(
        process.env.MERCADOPAGO_ACCESS_TOKEN ||
        process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS ||
        process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT
    );

    if (!hasAnyMpToken) {
        missing.payment.push('MERCADOPAGO_ACCESS_TOKEN (or SUBS/TRANSPARENT variants)');
    }

    // Check optional variables
    requiredVars.optional.forEach(varName => {
        if (!process.env[varName]) {
            missing.optional.push(varName);
        }
    });

    // Report results
    if (missing.critical.length > 0) {
        console.error('\n❌ CRITICAL: Missing required environment variables:');
        missing.critical.forEach(v => console.error(`   - ${v}`));
        console.error('\nThe server cannot start without these variables.');
        console.error('Please check your .env file and restart.\n');
        process.exit(1);
    }

    if (missing.payment.length > 0) {
        console.warn('\n⚠️  WARNING: Missing payment configuration:');
        missing.payment.forEach(v => console.warn(`   - ${v}`));
        console.warn('\nPayment features may not work correctly.\n');
    }

    if (missing.optional.length > 0) {
        console.info('\nℹ️  INFO: Optional integrations not configured:');
        missing.optional.forEach(v => {
            const feature = getFeatureName(v);
            console.info(`   - ${v} (${feature})`);
        });
        console.info('');
    }

    console.log('✅ Environment validation passed\n');
}

function getFeatureName(varName) {
    const features = {
        'MERCADOPAGO_ACCESS_TOKEN_SUBS': 'Mercado Pago Subscriptions',
        'MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT': 'Mercado Pago Transparent Checkout',
        'GOOGLE_CLIENT_ID': 'Google OAuth Login',
        'GOOGLE_CLIENT_SECRET': 'Google OAuth Login',
        'MELHOR_ENVIO_TOKEN': 'Melhor Envio Shipping',
    };
    return features[varName] || 'Unknown feature';
}

export function getIntegrationStatus() {
    return {
        mercadoPagoPayment: !!(
            process.env.MERCADOPAGO_ACCESS_TOKEN_TRANSPARENT ||
            process.env.MERCADOPAGO_ACCESS_TOKEN
        ),
        mercadoPagoSubscription: !!(
            process.env.MERCADOPAGO_ACCESS_TOKEN_SUBS ||
            process.env.MERCADOPAGO_ACCESS_TOKEN
        ),
        googleOAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        melhorEnvio: !!process.env.MELHOR_ENVIO_TOKEN,
    };
}
