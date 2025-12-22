import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { technicianSchema, defaultTechnicianValues } from '@/schemas/technician.schema';
import type { TechnicianFormData } from '@/schemas/technician.schema';
import { TechnicianSpecialty } from '@/modules/shared/types/technician';
import { useCreateTechnician } from '@/hooks/useTechnicians';
import { useTenants } from '@/hooks/useTenants';
import { TenantStatus } from '@/modules/shared/types/tenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { MaskedInput } from '@/components/form/MaskedInput';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft } from 'lucide-react';

export const TechnicianCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTechnician();

  // Buscar lista de tenants para multi-select
  const { data: tenantsData } = useTenants({ status: TenantStatus.ACTIVE, limit: 100 });
  const tenants = tenantsData?.tenants || [];

  const form = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: defaultTechnicianValues
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit } = form;

  const onSubmit = async (data: TechnicianFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty as TechnicianSpecialty,
        region: data.region,
        assignedTenants: data.assignedTenants
      });
      navigate('/admin/technicians');
    } catch (error) {
      console.error('Erro ao criar técnico:', error);
    }
  };

  const toggleTenant = (tenantId: string) => {
    const currentTenants = watch('assignedTenants') || [];
    const newTenants = currentTenants.includes(tenantId)
      ? currentTenants.filter(id => id !== tenantId)
      : [...currentTenants, tenantId];
    setValue('assignedTenants', newTenants);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/technicians')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Técnico</h1>
          <p className="text-sm text-gray-600">Cadastre um novo técnico/instalador</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados Pessoais</h3>

          <FormField label="Nome Completo" name="name" error={errors.name} required>
            <Input {...register('name')} placeholder="Ex: Pedro Silva" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" name="email" error={errors.email} required>
              <Input type="email" {...register('email')} placeholder="tecnico@unifique.com" />
            </FormField>

            <FormField label="Telefone" name="phone" error={errors.phone} required>
              <MaskedInput
                mask="(99) 99999-9999"
                value={watch('phone') || ''}
                onChange={(e) => setValue('phone', e.target.value)}
                placeholder="(11) 98765-4321"
              />
            </FormField>
          </div>
        </div>

        {/* Especialidade e Região */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Especialidade e Atuação</h3>

          <FormField label="Especialidade" name="specialty" error={errors.specialty} required>
            <Select
              value={watch('specialty') || ''}
              onValueChange={(value: string) => setValue('specialty', value as 'ALL' | 'INSTALLATION' | 'NETWORK' | 'ONVIF_CONFIG' | 'MAINTENANCE' | 'TROUBLESHOOTING')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INSTALLATION">Instalação Física</SelectItem>
                <SelectItem value="NETWORK">Configuração de Redes</SelectItem>
                <SelectItem value="ONVIF_CONFIG">Configuração ONVIF/RTSP</SelectItem>
                <SelectItem value="MAINTENANCE">Manutenção Preventiva</SelectItem>
                <SelectItem value="TROUBLESHOOTING">Resolução de Problemas</SelectItem>
                <SelectItem value="ALL">Todas as Especialidades</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Região de Atuação" name="region" error={errors.region}>
            <Input 
              {...register('region')} 
              placeholder="Ex: São Paulo - Zona Sul, Rio de Janeiro, etc." 
            />
          </FormField>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> A região ajuda na logística de atendimento. 
              Exemplo: "São Paulo - Zona Sul", "Grande ABC", "Interior SP".
            </p>
          </div>
        </div>

        {/* Clientes Atribuídos (Multi-select) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Clientes Atribuídos
            <span className="text-red-500 ml-1">*</span>
          </h3>

          <p className="text-sm text-gray-600">
            Selecione os clientes que este técnico poderá atender. 
            O técnico terá acesso apenas aos clientes selecionados.
          </p>

          {errors.assignedTenants && (
            <p className="text-sm text-red-600">{errors.assignedTenants.message}</p>
          )}

          <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
            {tenants.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum cliente ativo encontrado. Cadastre clientes primeiro.
              </p>
            ) : (
              tenants.map((tenant) => {
                const isSelected = (watch('assignedTenants') || []).includes(tenant.id);
                return (
                  <label
                    key={tenant.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                      isSelected 
                        ? 'bg-blue-50 border-2 border-blue-500' 
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTenant(tenant.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-xs text-gray-500">{tenant.fiscalData.cnpj}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      tenant.status === 'TRIAL' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tenant.status}
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <div className="text-sm text-gray-600">
            <strong>Selecionados:</strong> {(watch('assignedTenants') || []).length} cliente(s)
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/technicians')}>
            Cancelar
          </Button>
          <LoadingButton type="submit" isLoading={createMutation.isPending}>
            Cadastrar Técnico
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
