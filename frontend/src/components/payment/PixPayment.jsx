import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { QrCode, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PixPayment({ orderId, onSuccess, onError }) {
    const [paymentId, setPaymentId] = useState(null);
    const [copied, setCopied] = useState(false);

    // Create PIX payment
    const { data: pixData, isLoading: isCreating, error: createError } = useQuery({
        queryKey: ['pix-payment', orderId],
        queryFn: async () => {
            toast.info('Gerando código PIX...');
            const response = await api.post('/payment/create-pix', { orderId });
            setPaymentId(response.data.paymentId);
            toast.success('Código PIX gerado!');
            return response.data;
        },
        enabled: !!orderId,
        retry: 1,
    });

    // Poll payment status every 5 seconds
    const { data: statusData } = useQuery({
        queryKey: ['pix-status', paymentId],
        queryFn: async () => {
            const response = await api.get(`/payment/check/${paymentId}`);

            if (response.data.status === 'approved') {
                toast.success('Pagamento confirmado!', {
                    duration: 5000,
                });
                onSuccess?.(response.data);
            }

            return response.data;
        },
        enabled: !!paymentId,
        refetchInterval: (data) => {
            // Stop polling if approved
            return data?.status === 'approved' ? false : 5000;
        },
        refetchIntervalInBackground: true,
    });

    useEffect(() => {
        if (createError) {
            const errorMsg = createError.response?.data?.message || 'Erro ao gerar código PIX';
            toast.error(errorMsg);
            onError?.(errorMsg);
        }
    }, [createError, onError]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(pixData.qrCode);
            setCopied(true);
            toast.success('Código copiado!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Erro ao copiar código');
        }
    };

    if (isCreating) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#8B7355]" />
                <p className="text-gray-600">Gerando código PIX...</p>
            </div>
        );
    }

    if (createError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Erro ao gerar código PIX</p>
                <Button onClick={() => window.location.reload()}>
                    Tentar novamente
                </Button>
            </div>
        );
    }

    const isPaid = statusData?.status === 'approved';

    return (
        <div className="max-w-md mx-auto space-y-6">
            {/* Status Banner */}
            {isPaid ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                        <p className="font-semibold text-green-900">Pagamento confirmado!</p>
                        <p className="text-sm text-green-700">Seu pedido será processado em breve</p>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <p className="font-semibold text-blue-900">Aguardando pagamento</p>
                    </div>
                    <p className="text-sm text-blue-700">
                        Escaneie o QR Code ou copie o código para pagar
                    </p>
                </div>
            )}

            {/* QR Code */}
            {pixData?.qrCodeBase64 && !isPaid && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                        <QrCode className="w-6 h-6 text-[#8B7355] mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Pagar com PIX</h3>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <img
                            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                            alt="QR Code PIX"
                            className="w-full max-w-xs mx-auto"
                        />
                    </div>

                    {/* Copy Code */}
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 text-center font-medium">
                            Ou copie o código abaixo:
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={pixData.qrCode}
                                readOnly
                                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 font-mono"
                                onClick={(e) => e.target.select()}
                            />
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        Copiado!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copiar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 space-y-2 text-sm text-gray-600">
                        <p className="font-semibold text-gray-900">Como pagar:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Abra o app do seu banco</li>
                            <li>Escolha pagar com PIX</li>
                            <li>Escaneie o QR Code ou cole o código</li>
                            <li>Confirme o pagamento</li>
                        </ol>
                        <p className="text-xs text-gray-500 mt-4">
                            O pagamento será confirmado automaticamente em segundos
                        </p>
                    </div>
                </div>
            )}

            {/* Paid State */}
            {isPaid && (
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Pagamento confirmado!
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Obrigado pela sua compra. Você receberá um e-mail com os detalhes do pedido.
                    </p>
                </div>
            )}
        </div>
    );
}
