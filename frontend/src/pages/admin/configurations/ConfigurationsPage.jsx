import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ImageUploadField from '../../components/admin/content/ImageUploadField';
import api from '../../../lib/api';

const SECTIONS = {
  GENERAL: 'general',
  BRANDING: 'branding',
  SOCIAL: 'social',
  SCRIPTS: 'scripts',
  CMS_HOME: 'cms_home',
  CMS_FOOTER: 'cms_footer',
};

export default function ConfigurationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(SECTIONS.GENERAL);

  // Fetch settings for the active tab
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', activeTab],
    queryFn: async () => {
      const response = await api.get(`/settings/${activeTab}`);
      return response.data;
    },
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: async (newSettings) => {
      await api.put(`/settings/${activeTab}`, newSettings);
    },
    onSuccess: () => {
      toast.success('Configurações salvas com sucesso!');
      queryClient.invalidateQueries(['settings', activeTab]);
    },
    onError: () => {
      toast.error('Erro ao salvar configurações.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Merge with existing settings to keep non-form fields (like images handled separately)
    const mergedSettings = { ...settings, ...data };
    mutation.mutate(mergedSettings);
  };

  const handleImageChange = (key, url) => {
    const newSettings = { ...settings, [key]: url };
    // Optimistically update cache to show new image immediately
    queryClient.setQueryData(['settings', activeTab], newSettings);
    // Auto-save on image change
    mutation.mutate(newSettings);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#8B7355]">Configurações do Site</h1>
        <p className="text-muted-foreground">
          Gerencie a identidade, aparência e integrações da sua loja.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value={SECTIONS.GENERAL}>Geral</TabsTrigger>
          <TabsTrigger value={SECTIONS.BRANDING}>Marca & Cores</TabsTrigger>
          <TabsTrigger value={SECTIONS.SOCIAL}>Redes Sociais</TabsTrigger>
          <TabsTrigger value={SECTIONS.SCRIPTS}>Scripts & Analytics</TabsTrigger>
          <TabsTrigger value={SECTIONS.CMS_HOME}>Home CMS</TabsTrigger>
          <TabsTrigger value={SECTIONS.CMS_FOOTER}>Rodapé</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value={SECTIONS.GENERAL}>
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
                <CardDescription>Nome da loja, descrição e logotipos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input id="storeName" name="storeName" defaultValue={settings?.storeName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (SEO)</Label>
                  <Textarea id="description" name="description" defaultValue={settings?.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <ImageUploadField
                    label="Logo Principal"
                    value={settings?.logo}
                    onChange={(url) => handleImageChange('logo', url)}
                  />
                  <ImageUploadField
                    label="Favicon"
                    value={settings?.favicon}
                    onChange={(url) => handleImageChange('favicon', url)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={SECTIONS.BRANDING}>
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>Cores e fontes que definem sua marca.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="primaryColor" name="primaryColor" defaultValue={settings?.primaryColor} className="w-12 h-10 p-1" />
                      <Input defaultValue={settings?.primaryColor} readOnly className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="secondaryColor" name="secondaryColor" defaultValue={settings?.secondaryColor} className="w-12 h-10 p-1" />
                      <Input defaultValue={settings?.secondaryColor} readOnly className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="backgroundColor" name="backgroundColor" defaultValue={settings?.backgroundColor} className="w-12 h-10 p-1" />
                      <Input defaultValue={settings?.backgroundColor} readOnly className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Cor do Texto</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="textColor" name="textColor" defaultValue={settings?.textColor} className="w-12 h-10 p-1" />
                      <Input defaultValue={settings?.textColor} readOnly className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="headingFont">Fonte de Títulos</Label>
                    <Input id="headingFont" name="headingFont" defaultValue={settings?.headingFont} placeholder="Ex: Inter, Roboto" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFont">Fonte de Texto</Label>
                    <Input id="bodyFont" name="bodyFont" defaultValue={settings?.bodyFont} placeholder="Ex: Inter, Open Sans" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={SECTIONS.SOCIAL}>
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>Links para seus perfis sociais.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input id="instagram" name="instagram" defaultValue={settings?.instagram} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input id="facebook" name="facebook" defaultValue={settings?.facebook} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok URL</Label>
                  <Input id="tiktok" name="tiktok" defaultValue={settings?.tiktok} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (Link ou Número)</Label>
                  <Input id="whatsapp" name="whatsapp" defaultValue={settings?.whatsapp} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={SECTIONS.SCRIPTS}>
            <Card>
              <CardHeader>
                <CardTitle>Scripts & Rastreamento</CardTitle>
                <CardDescription>Google Analytics, Pixel e scripts customizados.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID (G-XXXXXXXX)</Label>
                  <Input id="googleAnalyticsId" name="googleAnalyticsId" defaultValue={settings?.googleAnalyticsId} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input id="facebookPixelId" name="facebookPixelId" defaultValue={settings?.facebookPixelId} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customHead">Scripts no &lt;HEAD&gt;</Label>
                  <Textarea id="customHead" name="customHead" defaultValue={settings?.customHead} className="font-mono text-xs h-32" placeholder="<script>...</script>" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customBody">Scripts no Fim do &lt;BODY&gt;</Label>
                  <Textarea id="customBody" name="customBody" defaultValue={settings?.customBody} className="font-mono text-xs h-32" placeholder="<script>...</script>" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={SECTIONS.CMS_HOME}>
            <Card>
              <CardHeader>
                <CardTitle>Homepage Hero</CardTitle>
                <CardDescription>Personalize a seção principal da página inicial.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Note: CMS structure is nested, so we map form fields to nested object on submit if needed, 
                    but for simplicity we'll flatten the form names and handle structure in backend or pre-submit if complex.
                    Here we assume simple structure or handle nesting manually. 
                    For this implementation, let's assume flat keys for simplicity or use a more robust form library later.
                    Actually, let's just use the 'hero' object directly if possible.
                */}
                <div className="space-y-2">
                  <Label>Título Principal</Label>
                  <Input
                    value={settings?.hero?.title || ''}
                    onChange={(e) => {
                      const newHero = { ...settings.hero, title: e.target.value };
                      queryClient.setQueryData(['settings', activeTab], { ...settings, hero: newHero });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={settings?.hero?.subtitle || ''}
                    onChange={(e) => {
                      const newHero = { ...settings.hero, subtitle: e.target.value };
                      queryClient.setQueryData(['settings', activeTab], { ...settings, hero: newHero });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texto do Botão</Label>
                  <Input
                    value={settings?.hero?.ctaText || ''}
                    onChange={(e) => {
                      const newHero = { ...settings.hero, ctaText: e.target.value };
                      queryClient.setQueryData(['settings', activeTab], { ...settings, hero: newHero });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link do Botão</Label>
                  <Input
                    value={settings?.hero?.ctaLink || ''}
                    onChange={(e) => {
                      const newHero = { ...settings.hero, ctaLink: e.target.value };
                      queryClient.setQueryData(['settings', activeTab], { ...settings, hero: newHero });
                    }}
                  />
                </div>
                <ImageUploadField
                  label="Imagem de Fundo"
                  value={settings?.hero?.image}
                  onChange={(url) => {
                    const newHero = { ...settings.hero, image: url };
                    const newSettings = { ...settings, hero: newHero };
                    queryClient.setQueryData(['settings', activeTab], newSettings);
                    mutation.mutate(newSettings);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value={SECTIONS.CMS_FOOTER}>
            <Card>
              <CardHeader>
                <CardTitle>Rodapé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="copyrightText">Texto de Copyright</Label>
                  <Input id="copyrightText" name="copyrightText" defaultValue={settings?.copyrightText} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
