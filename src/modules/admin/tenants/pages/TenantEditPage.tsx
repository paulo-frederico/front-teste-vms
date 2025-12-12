import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantSchema } from '@/schemas/tenant.schema';
import type { TenantFormData } from '@/schemas/tenant.schema';
import { useTenant, useUpdateTenant } from '@/hooks/useTenants';
import { TenantFormTabs } from '../components/TenantFormTabs';
import { LoadingButton } from '@/components/form/LoadingButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const TenantEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: tenant, isLoading } = useTenant(id!);
  const updateMutation = useUpdateTenant();

  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema)
  });

  // Preencher formulário com dados do tenant
  useEffect(() => {
    if (tenant) {
      form.reset({
        name: tenant.name,
        plan: tenant.plan,
        limits: tenant.limits,
        fiscalData: tenant.fiscalData,
        primaryContact: tenant.primaryContact,
        contractDate: tenant.contractDate,
        expirationDate: tenant.expirationDate
      });
    }
  }, [tenant, form]);

  const onSubmit = async (data: TenantFormData) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data: data as any });
      navigate('/admin/tenants');
    } catch (error) {
      console.error('Erro ao atualizar tenant:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Cliente não encontrado
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-sm text-gray-600">{tenant.name}</p>
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
            isLoading={updateMutation.isPending}
          >
            Salvar Alterações
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
