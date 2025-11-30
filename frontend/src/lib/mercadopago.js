// MercadoPago.js SDK integration for secure card tokenization
//CRITICAL: This uses the PUBLIC KEY - never the access token!

let mp = null;

// Initialize MercadoPago SDK
export const initMercadoPago = () => {
    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;

    if (!publicKey) {
        console.error('[MP SDK] VITE_MP_PUBLIC_KEY not configured');
        return null;
    }

    if (typeof MercadoPago === 'undefined') {
        console.error('[MP SDK] MercadoPago.js not loaded');
        return null;
    }

    if (!mp) {
        mp = new MercadoPago(publicKey, {
            locale: 'pt-BR'
        });
        console.log('[MP SDK] Initialized successfully');
    }

    return mp;
};

// Create card token (secure - happens in Mercado Pago servers)
export const createCardToken = async (cardData) => {
    const mpInstance = initMercadoPago();

    if (!mpInstance) {
        throw new Error('MercadoPago SDK not initialized');
    }

    try {
        console.log('[MP SDK] Creating card token...');

        // Tokenize card data (secure, NO card data sent to our backend)
        const token = await mpInstance.fields.createCardToken({
            cardNumber: cardData.number.replace(/\s/g, ''), // Remove spaces
            cardholderName: cardData.holderName,
            cardExpirationMonth: cardData.expMonth,
            cardExpirationYear: cardData.expYear,
            securityCode: cardData.cvv,
            identificationType: cardData.docType || 'CPF',
            identificationNumber: cardData.docNumber.replace(/\D/g, ''), // Remove formatting
        });

        console.log('[MP SDK] Token created successfully');

        return {
            id: token.id,
            paymentMethodId: token.payment_method_id,
            issuerId: token.issuer_id,
            firstSixDigits: token.first_six_digits,
            lastFourDigits: token.last_four_digits,
        };

    } catch (error) {
        console.error('[MP SDK] Error creating token:', error);

        // Parse MP errors
        if (error.cause) {
            const mpError = error.cause[0];
            throw new Error(mpError?.message || 'Erro ao processar cartão');
        }

        throw error;
    }
};

// Get available payment methods
export const getPaymentMethods = async (bin) => {
    const mpInstance = initMercadoPago();

    if (!mpInstance) {
        return [];
    }

    try {
        const paymentMethods = await mpInstance.getPaymentMethods({ bin });
        return paymentMethods.results || [];
    } catch (error) {
        console.error('[MP SDK] Error getting payment methods:', error);
        return [];
    }
};

// Get installments options
export const getInstallments = async (amount, bin) => {
    const mpInstance = initMercadoPago();

    if (!mpInstance) {
        return [];
    }

    try {
        const installments = await mpInstance.getInstallments({
            amount: parseFloat(amount),
            bin,
        });

        return installments[0]?.payer_costs || [];
    } catch (error) {
        console.error('[MP SDK] Error getting installments:', error);
        return [];
    }
};

// Validate card number (Luhn algorithm)
export const validateCardNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');

    if (cleaned.length < 13 || cleaned.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

// Format card number for display
export const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
};

// Format expiration date (MM/YY)
export const formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
};

// Format CPF/CNPJ
export const formatDocument = (value, type = 'CPF') => {
    const cleaned = value.replace(/\D/g, '');

    if (type === 'CPF') {
        // XXX.XXX.XXX-XX
        if (cleaned.length <= 11) {
            return cleaned
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
    } else {
        // XX.XXX.XXX/XXXX-XX
        return cleaned
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    return cleaned;
};

export default {
    initMercadoPago,
    createCardToken,
    getPaymentMethods,
    getInstallments,
    validateCardNumber,
    formatCardNumber,
    formatExpiration,
    formatDocument,
};
