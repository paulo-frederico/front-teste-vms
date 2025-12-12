import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminSchema, defaultAdminValues } from '@/schemas/admin.schema';
import type { AdminFormData } from '@/schemas/admin.schema';
import { useCreateAdmin } from '@/hooks/useAdmins';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { MaskedInput } from '@/components/form/MaskedInput';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft } from 'lucide-react';

export const AdminCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateAdmin();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: defaultAdminValues
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit } = form;

  const onSubmit = async (data: AdminFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password!,
        phone: data.phone
      });
      navigate('/admin/admins');
    } catch (error) {
      console.error('Erro ao criar admin:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/admins')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Administrador</h1>
          <p className="text-sm text-gray-600">Preencha os dados do novo admin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <FormField label="Nome Completo" name="name" error={errors.name} required>
          <Input {...register('name')} placeholder="Ex: João Silva" />
        </FormField>

        <FormField label="Email" name="email" error={errors.email} required>
          <Input type="email" {...register('email')} placeholder="admin@unifique.com" />
        </FormField>

        <FormField label="Telefone" name="phone" error={errors.phone}>
          <MaskedInput
            mask="(99) 99999-9999"
            value={watch('phone') || ''}
            onChange={(e) => setValue('phone', e.target.value)}
            placeholder="(11) 98765-4321"
          />
        </FormField>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Senha de Acesso</h3>

          <FormField label="Senha" name="password" error={errors.password} required>
            <Input type="password" {...register('password')} placeholder="Mínimo 8 caracteres" />
          </FormField>

          <FormField label="Confirmar Senha" name="confirmPassword" error={errors.confirmPassword} required>
            <Input type="password" {...register('confirmPassword')} placeholder="Digite a senha novamente" />
          </FormField>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800"><strong>Requisitos da senha:</strong></p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Mínimo 8 caracteres</li>
              <li>• Ao menos uma letra maiúscula</li>
              <li>• Ao menos uma letra minúscula</li>
              <li>• Ao menos um número</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/admins')}>
            Cancelar
          </Button>
          <LoadingButton type="submit" isLoading={createMutation.isPending}>
            Criar Admin
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
