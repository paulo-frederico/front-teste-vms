import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cameraSchema, defaultCameraValues, generateStreamUrl } from '@/schemas/camera.schema';
import type { CameraFormData } from '@/schemas/camera.schema';
import { useCreateCamera, useTestConnection } from '@/hooks/useCameras';
import { useTenants } from '@/hooks/useTenants';
import { CameraProtocol, RecordingMode } from '@/modules/shared/types/camera';
import { TenantStatus } from '@/modules/shared/types/tenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft, Wand2, Wifi } from 'lucide-react';

export const CameraCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCamera();
  const testConnectionMutation = useTestConnection();

  const { data: tenantsData } = useTenants({ status: TenantStatus.ACTIVE, limit: 100 });
  const tenants = tenantsData?.tenants || [];

  const [connectionTested, setConnectionTested] = useState(false);

  const form = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: defaultCameraValues as CameraFormData
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit } = form;

  const onSubmit = async (data: CameraFormData) => {
    try {
      await createMutation.mutateAsync({
        name: data.name,
        description: data.description,
        tenantId: data.tenantId,
        siteId: data.siteId,
        areaId: data.areaId,
        protocol: data.protocol as CameraProtocol,
        ipAddress: data.ipAddress,
        port: data.port,
        username: data.username,
        password: data.password,
        mainStreamUrl: data.mainStreamUrl,
        subStreamUrl: data.subStreamUrl,
        recordingMode: data.recordingMode as RecordingMode,
        retentionDays: data.retentionDays
      });
      navigate('/admin/cameras');
    } catch (error) {
      console.error('Erro ao criar câmera:', error);
    }
  };

  const handleGenerateUrl = () => {
    const protocol = watch('protocol');
    const ipAddress = watch('ipAddress');
    const port = watch('port');
    const username = watch('username');
    const password = watch('password');

    if (!ipAddress || !port || !username || !password) {
      alert('Preencha IP, Porta, Usuário e Senha primeiro');
      return;
    }

    const mainUrl = generateStreamUrl(protocol, ipAddress, port, username, password, '/stream1');
    const subUrl = generateStreamUrl(protocol, ipAddress, port, username, password, '/stream2');

    setValue('mainStreamUrl', mainUrl);
    setValue('subStreamUrl', subUrl);
  };

  const handleTestConnection = async () => {
    const protocol = watch('protocol');
    const ipAddress = watch('ipAddress');
    const port = watch('port');
    const username = watch('username');
    const password = watch('password');

    if (!ipAddress || !port || !username || !password) {
      alert('Preencha os dados de conexão primeiro');
      return;
    }

    const result = await testConnectionMutation.mutateAsync({
      protocol: protocol as CameraProtocol,
      ipAddress,
      port,
      username,
      password
    });

    setConnectionTested(result.success);
  };

  const retentionDays = watch('retentionDays') || 7;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/cameras')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Câmera</h1>
          <p className="text-sm text-gray-600">Cadastre uma nova câmera no sistema</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Básicas</h3>

          <FormField label="Nome da Câmera" name="name" error={errors.name} required>
            <Input {...register('name')} placeholder="Ex: Câmera Entrada Principal" />
          </FormField>

          <FormField label="Descrição" name="description" error={errors.description}>
            <Textarea 
              {...register('description')} 
              placeholder="Ex: Câmera fixa na entrada principal do prédio"
              rows={3}
              className="resize-none"
            />
          </FormField>

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
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>💡 Nota:</strong> Locais e Áreas serão implementados em breve. 
              Por enquanto, a câmera será vinculada apenas ao cliente.
            </p>
          </div>
        </div>

        {/* Conexão */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Conexão</h3>

          <FormField label="Protocolo" name="protocol" error={errors.protocol} required>
            <Select
              value={watch('protocol') || 'ONVIF'}
              onValueChange={(value: string) => setValue('protocol', value as 'ONVIF' | 'RTSP' | 'RTMP')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONVIF">ONVIF (Recomendado)</SelectItem>
                <SelectItem value="RTSP">RTSP</SelectItem>
                <SelectItem value="RTMP">RTMP</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Endereço IP" name="ipAddress" error={errors.ipAddress} required>
              <Input 
                {...register('ipAddress')} 
                placeholder="192.168.1.100"
              />
            </FormField>

            <FormField label="Porta" name="port" error={errors.port} required>
              <Input 
                type="number"
                {...register('port', { valueAsNumber: true })} 
                placeholder="554"
                min={1}
                max={65535}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Usuário" name="username" error={errors.username} required>
              <Input {...register('username')} placeholder="admin" />
            </FormField>

            <FormField label="Senha" name="password" error={errors.password} required>
              <Input type="password" {...register('password')} placeholder="••••••••" />
            </FormField>
          </div>

          {/* Botão Testar Conexão */}
          <div className="flex items-center gap-3">
            <LoadingButton
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              isLoading={testConnectionMutation.isPending}
            >
              <Wifi className="w-4 h-4 mr-2" />
              Testar Conexão
            </LoadingButton>

            {connectionTested && (
              <span className="text-sm text-green-600 font-medium">
                ✅ Conexão testada com sucesso!
              </span>
            )}
          </div>
        </div>

        {/* Streams */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-900">URLs de Stream</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateUrl}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar URLs Automaticamente
            </Button>
          </div>

          <FormField label="URL Stream Principal" name="mainStreamUrl" error={errors.mainStreamUrl} required>
            <Input 
              {...register('mainStreamUrl')} 
              placeholder="rtsp://192.168.1.100:554/stream1"
            />
          </FormField>

          <FormField label="URL Substream (Opcional)" name="subStreamUrl" error={errors.subStreamUrl}>
            <Input 
              {...register('subStreamUrl')} 
              placeholder="rtsp://192.168.1.100:554/stream2"
            />
          </FormField>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Use o botão "Gerar URLs Automaticamente" para criar as URLs 
              baseadas no protocolo, IP, porta e credenciais informados.
            </p>
          </div>
        </div>

        {/* Gravação */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Gravação</h3>

          <FormField label="Modo de Gravação" name="recordingMode" error={errors.recordingMode} required>
            <Select
              value={watch('recordingMode') || 'CONTINUOUS'}
              onValueChange={(value: string) => setValue('recordingMode', value as 'CONTINUOUS' | 'EVENT_BASED' | 'SCHEDULED' | 'DISABLED')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTINUOUS">Contínua (24/7)</SelectItem>
                <SelectItem value="EVENT_BASED">Baseada em Eventos</SelectItem>
                <SelectItem value="SCHEDULED">Agendada</SelectItem>
                <SelectItem value="DISABLED">Desabilitada</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Retenção de Gravação" name="retentionDays" error={errors.retentionDays} required>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">1 dia</span>
                <span className="text-sm text-gray-600">365 dias (1 ano)</span>
              </div>
              <input
                type="range"
                min="1"
                max="365"
                step="1"
                value={retentionDays}
                onChange={(e) => setValue('retentionDays', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-lg font-semibold text-blue-900">
                  {retentionDays} {retentionDays === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>
          </FormField>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/cameras')}>
            Cancelar
          </Button>
          <LoadingButton type="submit" isLoading={createMutation.isPending}>
            Cadastrar Câmera
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
