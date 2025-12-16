import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminSchema } from '@/schemas/admin.schema';
import type { AdminFormData } from '@/schemas/admin.schema';
import { useAdmin, useUpdateAdmin } from '@/hooks/useAdmins';
import type { CreateAdminDTO } from '@/services/api/admins.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/form/FormField';
import { MaskedInput } from '@/components/form/MaskedInput';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft } from 'lucide-react';

export const AdminEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: admin, isLoading } = useAdmin(id!);
  const updateMutation = useUpdateAdmin();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema)
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit, reset } = form;

  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        email: admin.email,
        phone: admin.phone || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data: AdminFormData) => {
    try {
      const updateData: Partial<CreateAdminDTO> = {
        name: data.name,
        email: data.email,
        phone: data.phone
      };

      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      await updateMutation.mutateAsync({ id: id!, data: updateData });
      navigate('/admin/admins');
    } catch (error) {
      console.error('Erro ao atualizar admin:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Admin não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/admins')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Administrador</h1>
          <p className="text-sm text-gray-600">{admin.name}</p>
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
          <h3 className="text-lg font-semibold mb-2">Alterar Senha</h3>
          <p className="text-sm text-gray-600 mb-4">Deixe em branco para manter a senha atual</p>

          <FormField label="Nova Senha" name="password" error={errors.password}>
            <Input type="password" {...register('password')} placeholder="Deixe em branco para não alterar" />
          </FormField>

          <FormField label="Confirmar Nova Senha" name="confirmPassword" error={errors.confirmPassword}>
            <Input type="password" {...register('confirmPassword')} placeholder="Digite a senha novamente" />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/admins')}>
            Cancelar
          </Button>
          <LoadingButton type="submit" isLoading={updateMutation.isPending}>
            Salvar Alterações
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
