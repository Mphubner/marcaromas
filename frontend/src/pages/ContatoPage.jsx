import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

// Meus serviços de API
import { pageSettingsService } from "../services/pageSettingsService";
import { contactService } from "../services/contactService";

export default function Contato() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: contactSettings } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: () => pageSettingsService.getSettingsBySection('contact'),
  });

  const submitMutation = useMutation({
    mutationFn: contactService.submitForm,
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  // Conteúdo padrão
  const content = contactSettings || {
    title: "Vamos Conversar?",
    subtitle: "Estamos aqui para ajudar! Entre em contato e responderemos em até 24 horas.",
    contact_info: {
      email: "clientmarcaromas@gmail.com",
      phone: "(27) 98865-0783",
      whatsapp: "(27) 98865-0783",
      address: "Rua Henrique Coutinho, 86 - Guarapari, ES"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <MessageSquare className="w-16 h-16 text-[#8B7355] mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-[#2C2419] mb-4">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#2C2419] mb-2">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-gray-600">
                      Obrigado pelo contato. Responderemos em breve! 💜
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="w-full bg-[#8B7355] hover:bg-[#6B5845] text-white"
                    >
                      {submitMutation.isPending ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#8B7355]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#8B7355]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2C2419] mb-1">Email</h3>
                      <a href={`mailto:${content.contact_info?.email}`} className="text-gray-600 hover:text-[#8B7355]">
                        {content.contact_info?.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#8B7355]/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#8B7355]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2C2419] mb-1">Telefone</h3>
                      <p className="text-gray-600">{content.contact_info?.phone}</p>
                      {content.contact_info?.whatsapp && (
                        <a
                          href={`https://wa.me/${content.contact_info.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          WhatsApp: {content.contact_info.whatsapp}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#8B7355]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#8B7355]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2C2419] mb-1">Endereço</h3>
                      <p className="text-gray-600">{content.contact_info?.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-gradient-to-br from-[#8B7355] to-[#6B5845] text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
                <div className="space-y-2 text-sm">
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 9h às 13h</p>
                  <p>Domingo: Fechado</p>
                </div>
                <p className="mt-6 text-sm opacity-90">
                  ⚡ Respondemos em até 24 horas úteis
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

