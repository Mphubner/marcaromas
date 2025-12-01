import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Lock, MapPin, Bell, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

// Premium Client Components
import {
  ClientPageHeader,
  ClientCard,
  ClientButton,
  ClientTabs,
  ClientAvatarUpload
} from '@/components/client';

// UI Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Services
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function PerfilPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailOrders: true,
    emailPromotions: true,
    emailNewsletter: true,
    pushOrders: false,
    pushPromotions: false
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: userService.getMyProfile,
    enabled: !!user
  });

  // Update form data when profile loads (React Query v5 compatible)
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        cpf: profile.cpf || '',
        birthDate: profile.birthDate || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userService.updateMyProfile,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries(['my-profile']);
      setUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: userService.updatePassword,
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  };

  const handleAvatarUpload = async (file) => {
    // TODO: Implement avatar upload to server
    toast.success('Foto de perfil atualizada!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // TODO: Implement account deletion
      toast.error('Funcionalidade em desenvolvimento');
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Muito fraca', color: 'bg-red-500' },
      { strength: 2, label: 'Fraca', color: 'bg-orange-500' },
      { strength: 3, label: 'Média', color: 'bg-yellow-500' },
      { strength: 4, label: 'Forte', color: 'bg-green-500' },
      { strength: 5, label: 'Muito forte', color: 'bg-green-600' }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355]" />
      </div>
    );
  }

  const tabs = [
    {
      label: 'Informações Pessoais',
      icon: User,
      content: (
        <form onSubmit={handleSubmitProfile} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <ClientAvatarUpload
              currentAvatar={profile?.avatar}
              name={formData.name}
              onUpload={handleAvatarUpload}
              size="xl"
            />
          </div>

          {/* Personal Info */}
          <ClientCard>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-2xl mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-2xl mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="rounded-2xl mt-2"
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="rounded-2xl mt-2"
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="rounded-2xl mt-2"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="bio">Sobre Você</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você..."
                className="rounded-2xl mt-2 min-h-[100px]"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.bio?.length || 0}/500 caracteres
              </p>
            </div>
          </ClientCard>

          <ClientButton type="submit" disabled={updateProfileMutation.isPending} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </ClientButton>
        </form>
      )
    },
    {
      label: 'Segurança',
      icon: Lock,
      content: (
        <div className="space-y-6">
          <ClientCard title="Alterar Senha" icon={Lock}>
            <form onSubmit={handleSubmitPassword} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Senha Atual *</Label>
                <div className="relative mt-2">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="rounded-2xl pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">Nova Senha *</Label>
                <div className="relative mt-2">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="rounded-2xl pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Força da senha:</span>
                      <span className={`text-sm font-semibold ${passwordStrength.strength >= 4 ? 'text-green-600' : 'text-gray-600'}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="rounded-2xl pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <ClientButton type="submit" disabled={updatePasswordMutation.isPending}>
                <Lock className="w-4 h-4 mr-2" />
                {updatePasswordMutation.isPending ? 'Alterando...' : 'Alterar Senha'}
              </ClientButton>
            </form>
          </ClientCard>

          {/* Danger Zone */}
          <ClientCard>
            <div className="border-2 border-red-200 rounded-2xl p-6 bg-red-50">
              <h3 className="text-lg font-bold text-red-900 mb-2">Zona de Perigo</h3>
              <p className="text-sm text-red-700 mb-4">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos. Esta ação não pode ser desfeita.
              </p>
              <ClientButton variant="danger" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Conta
              </ClientButton>
            </div>
          </ClientCard>
        </div>
      )
    },
    {
      label: 'Endereços',
      icon: MapPin,
      content: (
        <ClientCard>
          <p className="text-center text-gray-600 py-8">
            Gerenciamento de endereços será implementado em breve.
            <br />
            Por enquanto, você pode editar seu endereço principal nas configurações gerais.
          </p>
          <ClientButton variant="outline" className="mx-auto">
            <MapPin className="w-4 h-4 mr-2" />
            Adicionar Novo Endereço
          </ClientButton>
        </ClientCard>
      )
    },
    {
      label: 'Notificações',
      icon: Bell,
      content: (
        <ClientCard title="Preferências de Notificação" icon={Bell}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-[#2C2419] mb-4">Email</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Atualizações de Pedidos</p>
                    <p className="text-sm text-gray-600">Receba emails sobre status dos seus pedidos</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailOrders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, emailOrders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promoções e Ofertas</p>
                    <p className="text-sm text-gray-600">Receba ofertas especiais e descontos</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailPromotions}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, emailPromotions: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-gray-600">Dicas de bem-estar e novidades</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNewsletter}
                    onCheckedChange={(checked) =>
                      setNotificationSettings(prev => ({ ...prev, emailNewsletter: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h4 className="font-semibold text-[#2C2419] mb-4">Push (Em Breve)</h4>
              <p className="text-sm text-gray-600 mb-4">
                Notificações push estarão disponíveis em breve no aplicativo móvel.
              </p>
            </div>

            <ClientButton>
              <Save className="w-4 h-4 mr-2" />
              Salvar Preferências
            </ClientButton>
          </div>
        </ClientCard>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F9F8F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientPageHeader
          title="Meu Perfil"
          subtitle="Gerencie suas informações pessoais e preferências"
          backTo="/dashboard"
        />

        <ClientTabs tabs={tabs} />
      </div>
    </div>
  );
}
