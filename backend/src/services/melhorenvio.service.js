/**
 * Melhor Envio Service
 * Handles communication with Melhor Envio API
 */

import axios from 'axios';

const MELHOR_ENVIO_API_URL = 'https://melhorenvio.com.br/api/v2/me';

// Create axios instance for Melhor Envio
const melhorEnvioClient = axios.create({
    baseURL: MELHOR_ENVIO_API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Add authorization interceptor
melhorEnvioClient.interceptors.request.use((config) => {
    const token = process.env.MELHOR_ENVIO_TOKEN;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

/**
 * Calculate shipping rates
 * @param {Object} params - Shipping calculation parameters
 * @returns {Promise<Array>} Available shipping options
 */
export async function calculateShipping(params) {
    const { from, to, package: pkg } = params;

    try {
        const response = await melhorEnvioClient.post('/shipment/calculate', {
            from: {
                postal_code: from.postalCode,
            },
            to: {
                postal_code: to.postalCode,
            },
            package: {
                height: pkg.height || 10, // cm
                width: pkg.width || 20,   // cm
                length: pkg.length || 30,  // cm
                weight: pkg.weight || 0.5, // kg
            },
            options: {
                insurance_value: pkg.value || 0,
                receipt: false,
                own_hand: false,
            },
        });

        // Filter and format response
        return response.data.map(option => ({
            id: option.id,
            name: option.name,
            company: option.company.name,
            price: parseFloat(option.price),
            customPrice: parseFloat(option.custom_price),
            discount: parseFloat(option.discount),
            deliveryTime: option.delivery_time,
            deliveryRange: option.delivery_range,
            currency: option.currency,
        }));

    } catch (error) {
        console.error('[Melhor Envio] Error calculating shipping:', error.response?.data || error.message);
        throw new Error('Erro ao calcular frete. Tente novamente.');
    }
}

/**
 * Create shipping order
 * @param {Object} orderData - Shipping order data
 * @returns {Promise<Object>} Created order
 */
export async function createShippingOrder(orderData) {
    try {
        // Step 1: Add to cart
        const cartResponse = await melhorEnvioClient.post('/cart', {
            service: orderData.serviceId,
            from: {
                name: orderData.from.name,
                phone: orderData.from.phone,
                email: orderData.from.email,
                document: orderData.from.document,
                company_document: orderData.from.companyDocument || '',
                state_register: orderData.from.stateRegister || '',
                address: orderData.from.address,
                complement: orderData.from.complement || '',
                number: orderData.from.number,
                district: orderData.from.district,
                city: orderData.from.city,
                state_abbr: orderData.from.state,
                postal_code: orderData.from.postalCode,
                note: orderData.from.note || '',
            },
            to: {
                name: orderData.to.name,
                phone: orderData.to.phone,
                email: orderData.to.email,
                document: orderData.to.document,
                address: orderData.to.address,
                complement: orderData.to.complement || '',
                number: orderData.to.number,
                district: orderData.to.district,
                city: orderData.to.city,
                state_abbr: orderData.to.state,
                postal_code: orderData.to.postalCode,
                note: orderData.to.note || '',
            },
            products: orderData.products.map(p => ({
                name: p.name,
                quantity: p.quantity,
                unitary_value: p.unitaryValue,
            })),
            volumes: orderData.volumes.map(v => ({
                height: v.height,
                width: v.width,
                length: v.length,
                weight: v.weight,
            })),
            options: {
                insurance_value: orderData.insuranceValue || 0,
                receipt: orderData.receipt || false,
                own_hand: orderData.ownHand || false,
            },
        });

        const cartId = cartResponse.data.id;

        // Step 2: Checkout (purchase)
        const checkoutResponse = await melhorEnvioClient.post('/shipment/checkout', {
            orders: [cartId],
        });

        // Step 3: Generate label
        const generateResponse = await melhorEnvioClient.post('/shipment/generate', {
            orders: [cartId],
        });

        return {
            id: cartId,
            protocol: generateResponse.data[0]?.protocol || null,
            status: 'pending',
            trackingCode: null, // Will be available after processing
        };

    } catch (error) {
        console.error('[Melhor Envio] Error creating shipping order:', error.response?.data || error.message);
        throw new Error('Erro ao criar envio. Verifique os dados e tente novamente.');
    }
}

/**
 * Get tracking information
 * @param {string} trackingCode - Tracking code
 * @returns {Promise<Object>} Tracking information
 */
export async function getTrackingInfo(trackingCode) {
    try {
        const response = await melhorEnvioClient.get(`/shipment/tracking?codes=${trackingCode}`);

        if (!response.data || response.data.length === 0) {
            return null;
        }

        const tracking = response.data[0];

        return {
            trackingCode: tracking.code,
            status: tracking.status,
            events: tracking.events?.map(event => ({
                date: event.date,
                description: event.description,
                location: event.location,
            })) || [],
        };

    } catch (error) {
        console.error('[Melhor Envio] Error getting tracking:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Cancel shipping
 * @param {string} orderId - Order ID to cancel
 * @returns {Promise<boolean>} Success status
 */
export async function cancelShipping(orderId) {
    try {
        await melhorEnvioClient.post('/shipment/cancel', {
            order: {
                id: orderId,
            },
        });

        return true;

    } catch (error) {
        console.error('[Melhor Envio] Error cancelling shipping:', error.response?.data || error.message);
        throw new Error('Erro ao cancelar envio.');
    }
}

/**
 * Print shipping label
 * @param {string} orderId - Order ID
 * @returns {Promise<string>} PDF URL
 */
export async function printLabel(orderId) {
    try {
        const response = await melhorEnvioClient.post('/shipment/print', {
            mode: 'private',
            orders: [orderId],
        });

        return response.data.url;

    } catch (error) {
        console.error('[Melhor Envio] Error printing label:', error.response?.data || error.message);
        throw new Error('Erro ao gerar etiqueta.');
    }
}

export default {
    calculateShipping,
    createShippingOrder,
    getTrackingInfo,
    cancelShipping,
    printLabel,
};
