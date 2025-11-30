import { MercadoPagoConfig, Payment, PreApproval, Preference } from 'mercadopago';

// Initialize MP client with environment token
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: { timeout: 5000 }
});

// Export initialized APIs
export const paymentAPI = new Payment(client);
export const preapprovalAPI = new PreApproval(client);
export const preferenceAPI = new Preference(client);

// Helper to create payment preference (Checkout Pro)
export const createPaymentPreference = async (items, payer, metadata = {}) => {
    const preference = await preferenceAPI.create({
        body: {
            items,
            payer,
            back_urls: {
                success: `${process.env.FRONTEND_URL}/payment/success`,
                failure: `${process.env.FRONTEND_URL}/payment/failure`,
                pending: `${process.env.FRONTEND_URL}/payment/pending`,
            },
            auto_return: 'approved',
            external_reference: metadata.orderId || null,
            notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
            metadata,
        },
    });

    return preference;
};

// Helper to create PIX payment
export const createPixPayment = async (amount, payer, description, orderId) => {
    const payment = await paymentAPI.create({
        body: {
            transaction_amount: parseFloat(amount),
            payment_method_id: 'pix',
            description,
            payer: {
                email: payer.email,
                first_name: payer.name?.split(' ')[0],
                last_name: payer.name?.split(' ').slice(1).join(' '),
            },
            external_reference: orderId,
            notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
        },
    });

    return {
        id: payment.id,
        status: payment.status,
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url,
    };
};

// Helper to get payment status
export const getPaymentStatus = async (paymentId) => {
    const payment = await paymentAPI.get({ id: paymentId });
    return {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
    };
};

// Helper to create subscription preapproval
export const createSubscriptionPreapproval = async (planName, price, frequency, payerEmail) => {
    const preapproval = await preapprovalAPI.create({
        body: {
            reason: `Assinatura - ${planName}`,
            auto_recurring: {
                frequency: parseInt(frequency) || 1,
                frequency_type: 'months',
                transaction_amount: parseFloat(price),
                currency_id: 'BRL',
            },
            back_url: `${process.env.FRONTEND_URL}/subscription/success`,
            payer_email: payerEmail,
            notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
        },
    });

    return preapproval;
};
