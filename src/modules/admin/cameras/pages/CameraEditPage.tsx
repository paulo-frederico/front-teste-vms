import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cameraSchema, defaultCameraValues, generateStreamUrl } from '@/schemas/camera.schema';
import type { CameraFormData } from '@/schemas/camera.schema';
import { useCamera, useUpdateCamera, useTestConnection } from '@/hooks/useCameras';
import { CameraProtocol } from '@/modules/shared/types/camera';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft, Wand2, Wifi } from 'lucide-react';

export const CameraEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: camera, isLoading } = useCamera(id!);
  const updateMutation = useUpdateCamera();
  const testConnectionMutation = useTestConnection();

  const [connectionTested, setConnectionTested] = useState(false);

  const form = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
    defaultValues: defaultCameraValues as CameraFormData
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit, reset } = form;

  // Reset form quando a câmera é carregada
  useEffect(() => {
    if (camera) {
      reset({
        name: camera.name,
        description: camera.description || '',
        tenantId: camera.tenantId,
        siteId: camera.siteId || '',
        areaId: camera.areaId || '',
        protocol: camera.protocol,
        ipAddress: camera.ipAddress,
        port: camera.port,
        username: camera.credentials.username,
        password: camera.credentials.password,
        mainStreamUrl: camera.mainStreamUrl,
        subStreamUrl: camera.subStreamUrl || '',
        recordingMode: camera.recordingMode,
        retentionDays: camera.retentionDays
      });
    }
  }, [camera, reset]);

  const onSubmit = async (data: CameraFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: id!,
        data: {
          name: data.name,
          description: data.description,
          protocol: data.protocol,
          ipAddress: data.ipAddress,
          port: data.port,
          username: data.username,
          password: data.password,
          mainStreamUrl: data.mainStreamUrl,
          subStreamUrl: data.subStreamUrl,
          recordingMode: data.recordingMode,
          retentionDays: data.retentionDays
        }
      });
      navigate('/admin/cameras');
    } catch (error) {
      console.error('Erro ao atualizar câmera:', error);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (!camera) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Câmera não encontrada</h2>
          <p className="text-red-700 mb-4">A câmera solicitada não foi encontrada no sistema.</p>
          <Button onClick={() => navigate('/admin/cameras')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/cameras')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Câmera</h1>
          <p className="text-sm text-gray-600">{camera.name}</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Informações de Hardware (se disponível) */}
        {camera.hardwareInfo && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Informações do Hardware</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Fabricante:</span>
                <p className="text-blue-900">{camera.hardwareInfo.manufacturer || 'N/A'}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Modelo:</span>
                <p className="text-blue-900">{camera.hardwareInfo.model || 'N/A'}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Firmware:</span>
                <p className="text-blue-900">{camera.hardwareInfo.firmwareVersion || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

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

          {/* Cliente (não editável) */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Cliente:</p>
                <p className="text-base font-semibold text-gray-900">{camera.tenantName}</p>
              </div>
              <p className="text-xs text-gray-600 italic">O cliente não pode ser alterado</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>💡 Nota:</strong> Locais e Áreas serão implementados em breve. 
              Por enquanto, a câmera permanece vinculada apenas ao cliente.
            </p>
          </div>
        </div>

        {/* Conexão */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Conexão</h3>

          <FormField label="Protocolo" name="protocol" error={errors.protocol} required>
            <Select
              value={watch('protocol') || 'ONVIF'}
              onValueChange={(value) => setValue('protocol', value as any)}
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
              onValueChange={(value) => setValue('recordingMode', value as any)}
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
          <LoadingButton type="submit" isLoading={updateMutation.isPending}>
            Salvar Alterações
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
