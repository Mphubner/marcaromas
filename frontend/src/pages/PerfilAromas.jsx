import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton
} from '@/components/client';

// UI Components
import { Slider } from '@/components/ui/slider';

// Services
import { scentProfileService } from '../services/scentProfileService';
import { useAuth } from '../context/AuthContext';

const aromaCategories = [
  {
    id: 'citrico',
    name: 'Cítrico',
    description: 'Aromas frescos e energizantes',
    icon: '🍊',
    color: 'from-yellow-400 to-orange-500',
    examples: ['Limão', 'Laranja', 'Bergamota']
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Delicados e românticos',
    icon: '🌸',
    color: 'from-pink-400 to-purple-500',
    examples: ['Rosa', 'Lavanda', 'Jasmim']
  },
  {
    id: 'amadeirado',
    name: 'Amadeirado',
    description: 'Quentes e envolventes',
    icon: '🪵',
    color: 'from-amber-600 to-brown-700',
    examples: ['Sândalo', 'Cedro', 'Patchouli']
  },
  {
    id: 'herbal',
    name: 'Herbal',
    description: 'Naturais e refrescantes',
    icon: '🌿',
    color: 'from-green-400 to-emerald-600',
    examples: ['Eucalipto', 'Hortelã', 'Alecrim']
  },
  {
    id: 'vanilla',
    name: 'Baunilha',
    description: 'Doces e aconchegantes',
    icon: '🍦',
    color: 'from-yellow-200 to-amber-400',
    examples: ['Baunilha', 'Caramelo', 'Mel']
  },
  {
    id: 'frutal',
    name: 'Frutal',
    description: 'Vibrantes e alegres',
    icon: '🍓',
    color: 'from-red-400 to-pink-500',
    examples: ['Morango', 'Pêssego', 'Maçã']
  },
  {
    id: 'ocean',
    name: 'Oceânico',
    description: 'Frescos e limpos',
    icon: '🌊',
    color: 'from-cyan-400 to-blue-600',
    examples: ['Brisa Marinha', 'Algodão', 'Chuva']
  },
  {
    id: 'spicy',
    name: 'Especiarias',
    description: 'Intensos e marcantes',
    icon: '🌶️',
    color: 'from-orange-600 to-red-700',
    examples: ['Canela', 'Cravo', 'Gengibre']
  }
];

export default function PerfilAromas() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch user preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['my-scent-profile'],
    queryFn: scentProfileService.getMyProfile,
    enabled: !!user
  });

  // Initialize state with user preferences or defaults
  const [selectedAromas, setSelectedAromas] = useState(
    preferences?.aroma_families || []
  );
  const [intensity, setIntensity] = useState(
    preferences?.intensity_preference === 'light' ? 30 :
      preferences?.intensity_preference === 'strong' ? 80 : 50
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Update preferences mutation
  const saveMutation = useMutation({
    mutationFn: (data) => scentProfileService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-scent-profile']);
      toast.success('Preferências salvas com sucesso!');
      setHasChanges(false);
    },
    onError: () => {
      toast.error('Erro ao salvar preferências');
    }
  });

  const handleAromaToggle = (aromaId) => {
    const newSelected = selectedAromas.includes(aromaId)
      ? selectedAromas.filter(id => id !== aromaId)
      : [...selectedAromas, aromaId];

    setSelectedAromas(newSelected);
    setHasChanges(true);
  };

  const handleIntensityChange = (value) => {
    setIntensity(value[0]);
    setHasChanges(true);
  };

  const handleSave = () => {
    const intensityPref = intensity < 40 ? 'light' : intensity > 70 ? 'strong' : 'medium';

    saveMutation.mutate({
      aroma_families: selectedAromas,
      intensity_preference: intensityPref
    });
  };

  const handleReset = () => {
    setSelectedAromas(preferences?.aroma_families || []);
    const prefIntensity = preferences?.intensity_preference === 'light' ? 30 :
      preferences?.intensity_preference === 'strong' ? 80 : 50;
    setIntensity(prefIntensity);
    setHasChanges(false);
    toast.info('Preferências redefinidas');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Perfil de Aromas"
          subtitle="Personalize suas preferências para receber combinações perfeitas"
          backTo="/perfil"
          action={
            hasChanges && (
              <div className="flex gap-3">
                <ClientButton variant="ghost" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Resetar
                </ClientButton>
                <ClientButton onClick={handleSave} disabled={saveMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                </ClientButton>
              </div>
            )
          }
        />

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Como funciona?</p>
                <p>
                  Selecione até 3 categorias de aromas que você mais gosta. Usaremos suas
                  preferências para personalizar nossas recomendações e sugestões de produtos.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Aroma Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#2C2419] mb-6 font-['Playfair_Display']">
            Escolha seus Aromas Favoritos
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aromaCategories.map((aroma, index) => {
              const isSelected = selectedAromas.includes(aroma.id);
              const canSelect = selectedAromas.length < 3 || isSelected;

              return (
                <motion.div
                  key={aroma.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => canSelect && handleAromaToggle(aroma.id)}
                    disabled={!canSelect}
                    className={`w-full text-left transition-all duration-300 ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <ClientCard
                      hoverable={canSelect}
                      className={`relative ${isSelected
                          ? 'ring-4 ring-[#8B7355] shadow-2xl scale-105'
                          : 'hover:shadow-xl'
                        }`}
                    >
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#8B7355] flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}

                      {/* Icon with Gradient Background */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${aroma.color} flex items-center justify-center text-4xl mb-4 mx-auto`}>
                        {aroma.icon}
                      </div>

                      {/* Name */}
                      <h3 className="font-bold text-xl text-[#2C2419] mb-2 text-center">
                        {aroma.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 text-center mb-3">
                        {aroma.description}
                      </p>

                      {/* Examples */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {aroma.examples.map((example) => (
                          <span
                            key={example}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </ClientCard>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Selection Counter */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {selectedAromas.length}/3 aromas selecionados
            </p>
          </div>
        </div>

        {/* Intensity Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ClientCard>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#2C2419] mb-2 font-['Playfair_Display']">
                    <Sparkles className="w-6 h-6 inline mr-2 text-[#8B7355]" />
                    Intensidade Preferida
                  </h3>
                  <p className="text-gray-600">
                    Ajuste a intensidade dos aromas que você prefere
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-[#8B7355] font-['Playfair_Display']">
                    {intensity}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {intensity < 40 ? 'Suave' : intensity < 70 ? 'Moderado' : 'Intenso'}
                  </p>
                </div>
              </div>

              {/* Slider */}
              <div className="px-4">
                <Slider
                  value={[intensity]}
                  onValueChange={handleIntensityChange}
                  max={100}
                  step={1}
                  className="w-full"
                />

                {/* Labels */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Suave</span>
                  <span>Moderado</span>
                  <span>Intenso</span>
                </div>
              </div>
            </div>
          </ClientCard>
        </motion.div>

        {/* Selected Aromas Preview */}
        {selectedAromas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <ClientCard gradient>
              <div className="text-center text-white py-6">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3 font-['Playfair_Display']">
                  Seu Perfil de Aromas
                </h3>
                <div className="flex gap-3 justify-center flex-wrap mb-4">
                  {selectedAromas.map((id) => {
                    const aroma = aromaCategories.find(a => a.id === id);
                    return (
                      <div
                        key={id}
                        className="px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold"
                      >
                        {aroma?.icon} {aroma?.name}
                      </div>
                    );
                  })}
                </div>
                <p className="opacity-90 mb-6">
                  Vamos usar suas preferências para criar combinações perfeitas!
                </p>

                {hasChanges && (
                  <ClientButton variant="secondary" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Preferências
                  </ClientButton>
                )}
              </div>
            </ClientCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
