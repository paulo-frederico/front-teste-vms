import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { grantAccessSchema, defaultGrantAccessValues } from '@/schemas/technician.schema';
import type { GrantAccessFormData } from '@/schemas/technician.schema';
import { useGrantTemporaryAccess } from '@/hooks/useTechnicians';
import { useTechnician } from '@/hooks/useTechnicians';
import { useTenants } from '@/hooks/useTenants';
import { TenantStatus } from '@/modules/shared/types/tenant';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft, Clock, Shield, AlertTriangle } from 'lucide-react';

export const GrantAccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ID do técnico (opcional)
  const navigate = useNavigate();
  const grantAccessMutation = useGrantTemporaryAccess();

  // Buscar técnico se ID foi passado
  const { data: technician } = useTechnician(id || '');

  // Buscar lista de tenants ativos
  const { data: tenantsData } = useTenants({ status: TenantStatus.ACTIVE, limit: 100 });
  const tenants = tenantsData?.tenants || [];

  const form = useForm<GrantAccessFormData>({
    resolver: zodResolver(grantAccessSchema),
    defaultValues: {
      ...defaultGrantAccessValues,
      technicianId: id || ''
    }
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit } = form;

  // Calcular horário de expiração
  const durationMinutes = watch('durationMinutes') || 60;
  const expirationTime = new Date(Date.now() + durationMinutes * 60 * 1000);

  const onSubmit = async (data: GrantAccessFormData) => {
    try {
      await grantAccessMutation.mutateAsync({
        technicianId: data.technicianId,
        tenantId: data.tenantId,
        durationMinutes: data.durationMinutes,
        reason: data.reason,
        allowedActions: data.allowedActions,
        cameraIds: data.cameraIds,
        siteIds: data.siteIds
      });
      navigate('/admin/technicians');
    } catch (error) {
      console.error('Erro ao conceder acesso:', error);
    }
  };

  const toggleAction = (action: string) => {
    const currentActions = watch('allowedActions') || [];
    const newActions = currentActions.includes(action)
      ? currentActions.filter(a => a !== action)
      : [...currentActions, action];
    setValue('allowedActions', newActions);
  };

  const availableActions = [
    { id: 'install_camera', label: 'Instalar câmeras', icon: '📹' },
    { id: 'test_connection', label: 'Testar conexão', icon: '🔌' },
    { id: 'configure_onvif', label: 'Configurar ONVIF/RTSP', icon: '⚙️' },
    { id: 'configure_network', label: 'Configurar rede', icon: '🌐' },
    { id: 'view_live', label: 'Visualizar ao vivo', icon: '👁️' },
    { id: 'upload_evidence', label: 'Enviar evidências (fotos/vídeos)', icon: '📸' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/technicians')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Conceder Acesso Temporário
          </h1>
          <p className="text-sm text-gray-600">Libere acesso limitado ao técnico para instalação/manutenção</p>
        </div>
      </div>

      {/* Banner LGPD */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800">⚠️ Acesso Temporário - LGPD</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Este acesso é <strong>temporário e auditado</strong>. O técnico terá acesso limitado apenas às 
              funcionalidades selecionadas e será <strong>desconectado automaticamente</strong> ao expirar o prazo.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              <strong>Importante:</strong> O técnico NÃO terá acesso a gravações históricas ou análises de IA.
            </p>
          </div>
        </div>
      </div>

      {/* Técnico Selecionado (se vier da listagem) */}
      {technician && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Técnico Selecionado</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {technician.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">{technician.name}</div>
              <div className="text-xs text-blue-700">{technician.email} • {technician.phone}</div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Cliente */}
        <FormField label="Cliente" name="tenantId" error={errors.tenantId} required>
          <Select
            value={watch('tenantId') || ''}
            onValueChange={(value) => setValue('tenantId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.fiscalData.cnpj})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* Duração */}
        <div className="space-y-4">
          <FormField label="Duração do Acesso" name="durationMinutes" error={errors.durationMinutes} required>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">5 minutos</span>
                <span className="text-sm text-gray-600">8 horas (480 min)</span>
              </div>
              <input
                type="range"
                min="5"
                max="480"
                step="5"
                value={durationMinutes}
                onChange={(e) => setValue('durationMinutes', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-blue-900">
                  {Math.floor(durationMinutes / 60)}h {durationMinutes % 60}min
                </span>
              </div>
            </div>
          </FormField>

          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
            <strong>Expira em:</strong> {expirationTime.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* Motivo */}
        <FormField label="Motivo do Acesso" name="reason" error={errors.reason} required>
          <textarea
            {...register('reason')}
            placeholder="Ex: Instalação de 5 câmeras no setor administrativo + testes de conectividade"
            rows={4}
            className="resize-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 10 caracteres. Seja específico sobre o que o técnico irá fazer.
          </p>
        </FormField>

        {/* Ações Permitidas */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Ações Permitidas
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 mb-3">
              Selecione as ações que o técnico poderá executar durante o acesso
            </p>
          </div>

          {errors.allowedActions && (
            <p className="text-sm text-red-600">{errors.allowedActions.message}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {availableActions.map((action) => {
              const isSelected = (watch('allowedActions') || []).includes(action.id);
              return (
                <label
                  key={action.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border-2 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-gray-50 border-transparent hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAction(action.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </label>
              );
            })}
          </div>

          <div className="text-sm text-gray-600">
            <strong>Selecionadas:</strong> {(watch('allowedActions') || []).length} ação(ões)
          </div>
        </div>

        {/* Restrições Adicionais (Opcional) */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Restrições Adicionais (Opcional)</h3>

          <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm text-gray-700">
            <p>🔒 <strong>Câmeras específicas:</strong> Não implementado (futuro)</p>
            <p>🔒 <strong>Locais específicos:</strong> Não implementado (futuro)</p>
            <p className="text-xs text-gray-500 mt-2">
              Por padrão, o técnico terá acesso a todos os recursos do cliente selecionado.
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Acesso</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Técnico:</span>
              <span className="font-medium">{technician?.name || 'Não selecionado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-medium">
                {tenants.find(t => t.id === watch('tenantId'))?.name || 'Não selecionado'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duração:</span>
              <span className="font-medium">
                {Math.floor(durationMinutes / 60)}h {durationMinutes % 60}min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expira em:</span>
              <span className="font-medium">
                {expirationTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ações permitidas:</span>
              <span className="font-medium">{(watch('allowedActions') || []).length}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/technicians')}>
            Cancelar
          </Button>
          <LoadingButton 
            type="submit" 
            isLoading={grantAccessMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Conceder Acesso Temporário
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
