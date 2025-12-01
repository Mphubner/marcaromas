import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    MessageCircle,
    Send,
    Phone,
    Mail,
    Clock,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Client Components
import {
    ClientPageHeader,
    ClientCard,
    ClientButton,
    ClientBadge,
    ClientEmptyState
} from '@/components/client';

// UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const FAQ_ITEMS = [
    {
        id: 1,
        question: 'Como faço para rastrear meu pedido?',
        answer: 'Você pode rastrear seu pedido em Minhas Compras. Clique em "Rastrear Pedido" ao lado do pedido desejado. Você também receberá atualizações por email.'
    },
    {
        id: 2,
        question: 'Posso cancelar minha assinatura?',
        answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas. Acesse "Minha Assinatura" e clique em "Cancelar Assinatura". O acesso permanece até o fim do período pago.'
    },
    {
        id: 3,
        question: 'Qual é a política de troca e devolução?',
        answer: 'Você tem até 7 dias após o recebimento para solicitar troca ou devolução. O produto deve estar em perfeitas condições e na embalagem original. Entre em contato conosco para iniciar o processo.'
    },
    {
        id: 4,
        question: 'Como funciona o frete grátis?',
        answer: 'Compras acima de R$ 200,00 têm frete grátis para todo o Brasil. Assinantes do clube têm frete grátis em todas as compras.'
    },
    {
        id: 5,
        question: 'Posso pausar minha assinatura?',
        answer: 'Sim! Você pode pausar sua assinatura por até 3 meses. Acesse "Minha Assinatura" e selecione a opção "Pausar". Você não será cobrado durante a pausa.'
    },
    {
        id: 6,
        question: 'Quais formas de pagamento vocês aceitam?',
        answer: 'Aceitamos PIX, cartão de crédito (Visa, Mastercard, Amex), boleto bancário e débito online. Para assinaturas, recomendamos cartão de crédito ou PIX recorrente.'
    }
];

export default function Support() {
    const queryClient = useQueryClient();
    const [openFaqId, setOpenFaqId] = useState(null);

    // Ticket form state
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: '',
        message: '',
        orderId: ''
    });

    // Submit ticket mutation
    const submitTicketMutation = useMutation({
        mutationFn: async (ticketData) => {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { id: Date.now(), ...ticketData };
        },
        onSuccess: () => {
            toast.success('Ticket criado com sucesso! Entraremos em contato em breve.');
            setTicketForm({
                subject: '',
                category: '',
                message: '',
                orderId: ''
            });
        },
        onError: () => {
            toast.error('Erro ao enviar ticket. Tente novamente.');
        }
    });

    const handleSubmitTicket = (e) => {
        e.preventDefault();

        if (!ticketForm.subject || !ticketForm.category || !ticketForm.message) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        submitTicketMutation.mutate(ticketForm);
    };

    const toggleFaq = (id) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ClientPageHeader
                    title="Central de Ajuda"
                    subtitle="Estamos aqui para ajudar você"
                    backTo="/dashboard"
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Contact Options */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display']">
                                Fale Conosco
                            </h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                <ClientCard hoverable>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B7355] to-[#7A6548] flex items-center justify-center mx-auto mb-4">
                                            <MessageCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="font-bold text-[#2C2419] mb-2">Chat Online</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Disponível 24/7
                                        </p>
                                        <ClientButton variant="outline" size="sm">
                                            Iniciar Chat
                                        </ClientButton>
                                    </div>
                                </ClientCard>

                                <ClientCard hoverable>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="font-bold text-[#2C2419] mb-2">Email</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Resposta em 24h
                                        </p>
                                        <a href="mailto:suporte@marcaromas.com.br">
                                            <ClientButton variant="outline" size="sm">
                                                Enviar Email
                                            </ClientButton>
                                        </a>
                                    </div>
                                </ClientCard>

                                <ClientCard hoverable>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                                            <Phone className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="font-bold text-[#2C2419] mb-2">Telefone</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Seg-Sex 9h-18h
                                        </p>
                                        <a href="tel:+5511999999999">
                                            <ClientButton variant="outline" size="sm">
                                                (11) 9999-9999
                                            </ClientButton>
                                        </a>
                                    </div>
                                </ClientCard>
                            </div>
                        </motion.div>

                        {/* Create Ticket */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <ClientCard title="Abrir Chamado" icon={MessageCircle}>
                                <form onSubmit={handleSubmitTicket} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category">Categoria *</Label>
                                            <Select
                                                value={ticketForm.category}
                                                onValueChange={(value) =>
                                                    setTicketForm({ ...ticketForm, category: value })
                                                }
                                            >
                                                <SelectTrigger className="rounded-2xl">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="order">Pedidos</SelectItem>
                                                    <SelectItem value="payment">Pagamentos</SelectItem>
                                                    <SelectItem value="subscription">Assinaturas</SelectItem>
                                                    <SelectItem value="product">Produtos</SelectItem>
                                                    <SelectItem value="technical">Técnico</SelectItem>
                                                    <SelectItem value="other">Outro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="orderId">Número do Pedido (opcional)</Label>
                                            <Input
                                                id="orderId"
                                                placeholder="Ex: #1234"
                                                value={ticketForm.orderId}
                                                onChange={(e) =>
                                                    setTicketForm({ ...ticketForm, orderId: e.target.value })
                                                }
                                                className="rounded-2xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject">Assunto *</Label>
                                        <Input
                                            id="subject"
                                            placeholder="Descreva brevemente o problema"
                                            value={ticketForm.subject}
                                            onChange={(e) =>
                                                setTicketForm({ ...ticketForm, subject: e.target.value })
                                            }
                                            className="rounded-2xl"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Mensagem *</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Descreva detalhadamente sua dúvida ou problema..."
                                            value={ticketForm.message}
                                            onChange={(e) =>
                                                setTicketForm({ ...ticketForm, message: e.target.value })
                                            }
                                            className="rounded-2xl min-h-[120px]"
                                            required
                                        />
                                    </div>

                                    <ClientButton
                                        type="submit"
                                        disabled={submitTicketMutation.isPending}
                                        className="w-full"
                                    >
                                        {submitTicketMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Enviar Chamado
                                            </>
                                        )}
                                    </ClientButton>
                                </form>
                            </ClientCard>
                        </motion.div>

                        {/* FAQ */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display']">
                                Perguntas Frequentes
                            </h2>

                            <div className="space-y-4">
                                {FAQ_ITEMS.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                    >
                                        <ClientCard hoverable className="cursor-pointer">
                                            <button
                                                onClick={() => toggleFaq(item.id)}
                                                className="w-full text-left"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <HelpCircle className="w-5 h-5 text-[#8B7355] mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-[#2C2419] mb-1">
                                                                {item.question}
                                                            </h4>

                                                            <AnimatePresence>
                                                                {openFaqId === item.id && (
                                                                    <motion.p
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="text-sm text-gray-600 mt-2"
                                                                    >
                                                                        {item.answer}
                                                                    </motion.p>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>

                                                    {openFaqId === item.id ? (
                                                        <ChevronUp className="w-5 h-5 text-[#8B7355] flex-shrink-0" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </button>
                                        </ClientCard>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6 sticky top-24"
                        >
                            {/* Hours Card */}
                            <ClientCard title="Horário de Atendimento" icon={Clock}>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Segunda - Sexta</span>
                                        <span className="font-semibold">9h - 18h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sábado</span>
                                        <span className="font-semibold">9h - 14h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Domingo</span>
                                        <span className="font-semibold text-gray-500">Fechado</span>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="p-3 bg-green-50 rounded-2xl">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-sm font-semibold">Online agora</span>
                                    </div>
                                </div>
                            </ClientCard>

                            {/* Tips Card */}
                            <ClientCard gradient>
                                <div className="text-white">
                                    <h3 className="text-xl font-bold mb-4 font-['Playfair_Display']">
                                        Dicas Rápidas
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm opacity-90">
                                                Tenha seu número de pedido em mãos
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm opacity-90">
                                                Verifique o FAQ antes de abrir um chamado
                                            </p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm opacity-90">
                                                Resposta média em menos de 2 horas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ClientCard>

                            {/* Contact Info */}
                            <ClientCard>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-600 mb-1">Email</p>
                                        <a
                                            href="mailto:suporte@marcaromas.com.br"
                                            className="font-semibold text-[#8B7355] hover:underline"
                                        >
                                            suporte@marcaromas.com.br
                                        </a>
                                    </div>

                                    <Separator />

                                    <div>
                                        <p className="text-gray-600 mb-1">Telefone</p>
                                        <a
                                            href="tel:+5511999999999"
                                            className="font-semibold text-[#8B7355] hover:underline"
                                        >
                                            (11) 99999-9999
                                        </a>
                                    </div>

                                    <Separator />

                                    <div>
                                        <p className="text-gray-600 mb-1">WhatsApp</p>
                                        <a
                                            href="https://wa.me/5511999999999"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-[#8B7355] hover:underline"
                                        >
                                            (11) 99999-9999
                                        </a>
                                    </div>
                                </div>
                            </ClientCard>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
