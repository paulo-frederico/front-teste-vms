import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantSchema, defaultTenantValues } from '@/schemas/tenant.schema';
import type { TenantFormData } from '@/schemas/tenant.schema';
import { useCreateTenant } from '@/hooks/useTenants';
import { TenantFormTabs } from '../components/TenantFormTabs';
import { LoadingButton } from '@/components/form/LoadingButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const TenantCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTenant();

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: defaultTenantValues as TenantFormData
  });

  const onSubmit = async (data: TenantFormData) => {
    try {
      await createMutation.mutateAsync(data as unknown);
      navigate('/admin/tenants');
    } catch (error) {
      console.error('Erro ao criar tenant:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/tenants')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-sm text-gray-600">Preencha os dados do novo cliente</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
        <TenantFormTabs form={form} />

        {/* Ações */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/tenants')}
          >
            Cancelar
          </Button>
          <LoadingButton
            type="submit"
            isLoading={createMutation.isPending}
          >
            Criar Cliente
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
