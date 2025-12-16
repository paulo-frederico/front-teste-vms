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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/form/FormField';
import { LoadingButton } from '@/components/form/LoadingButton';
import { ArrowLeft, Wand2, Wifi, Lock, RefreshCw, Trash2 } from 'lucide-react';
import { 
  useCameraConfig, 
  useUpdateCameraConfig,
  useLockCamera,
  useRebootCamera
} from '@/hooks/useCameraConfig';
import { 
  getTimezones,
  calculateFrameTime
} from '@/modules/shared/types/camera-config';

export const CameraEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: camera, isLoading } = useCamera(id!);
  const updateMutation = useUpdateCamera();
  const testConnectionMutation = useTestConnection();

  const { data: cameraConfig } = useCameraConfig(id!);
  const updateConfigMutation = useUpdateCameraConfig();
  const lockCameraMutation = useLockCamera();
  const rebootCameraMutation = useRebootCamera();

  const [connectionTested, setConnectionTested] = useState(false);
  
  // Estados para a aba de Configuração
  const [brightness, setBrightness] = useState(138);
  const [contrast, setContrast] = useState(128);
  const [saturation, setSaturation] = useState(120);
  const [fps, setFps] = useState(12);
  const [frameTime, setFrameTime] = useState(24);
  
  // Estados para CODEC
  const [codecType, setCodecType] = useState<'VIDEO_ONLY' | 'VIDEO_AUDIO'>('VIDEO_ONLY');
  const [resolution, setResolution] = useState<'CIF' | 'D1' | 'HD' | 'FULL_HD' | 'QHD' | 'UHD_4K'>('HD');
  const [encoder, setEncoder] = useState<'H264' | 'H265' | 'MJPEG'>('H264');
  const [displayOSD, setDisplayOSD] = useState('');
  const [streamType, setStreamType] = useState<'MAIN_STREAM' | 'SUB_STREAM'>('MAIN_STREAM');
  const [bitRateType, setBitRateType] = useState<'CBR' | 'VBR'>('CBR');
  const [bitRate, setBitRate] = useState(1024);
  
  // Estados para IA
  const [enableAI, setEnableAI] = useState(false);
  const [recordOnMotionOnly, setRecordOnMotionOnly] = useState(false);
  const [faceDetect, setFaceDetect] = useState(false);
  const [motionContours, setMotionContours] = useState(true);
  
  // Estados para Device Info
  const [videoStandard, setVideoStandard] = useState<'NTSC' | 'PAL'>('NTSC');
  const [timezone, setTimezone] = useState('GMT-3:00');
  const [operationMode, setOperationMode] = useState<'ALL_DAYS' | 'SCHEDULED'>('ALL_DAYS');
  const [operationTime, setOperationTime] = useState('00:00');
  const [maintenanceDate, setMaintenanceDate] = useState('');
  
  // Atualizar frame time automaticamente quando FPS mudar
  useEffect(() => {
    setFrameTime(calculateFrameTime(fps));
  }, [fps]);
  
  // Preencher valores quando config carregar
  useEffect(() => {
    if (cameraConfig) {
      setBrightness(cameraConfig.image.brightness);
      setContrast(cameraConfig.image.contrast);
      setSaturation(cameraConfig.image.saturation);
      setFps(cameraConfig.codec.fps);
    }
  }, [cameraConfig]);

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

  const onSubmitConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfigMutation.mutateAsync({
        cameraId: id!,
        data: {
          // CODEC
          codecType,
          resolution,
          encoder,
          fps,
          frameTime,
          displayOSD,
          streamType,
          bitRateType,
          bitRate,

          // Imagem
          brightness,
          contrast,
          saturation,

          // IA
          enableAI,
          recordOnMotionOnly,
          faceDetect,
          motionContours,

          // Dispositivo
          videoStandard,
          timezone,
          operationMode,
          operationTime,

          // Manutenção
          maintenanceDate
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta câmera?\n\nEsta ação não pode ser desfeita.')) {
      console.log('Excluir câmera', id);
      // TODO: Implementar exclusão
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

      {/* Formulário com Tabs */}
      <Tabs defaultValue="basico" className="w-full">
        <TabsList>
          <TabsTrigger value="basico">Informações Básicas</TabsTrigger>
          <TabsTrigger value="conexao">Conexão</TabsTrigger>
          <TabsTrigger value="streams">URLs de Stream</TabsTrigger>
          <TabsTrigger value="gravacao">Gravação</TabsTrigger>
          <TabsTrigger value="configuracao">Configuração</TabsTrigger>
        </TabsList>

        {/* ABA INFORMAÇÕES BÁSICAS */}
        <TabsContent value="basico">
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
        </TabsContent>

        {/* ABA CONEXÃO */}
        <TabsContent value="conexao">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Conexão */}
            <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Conexão</h3>

          <FormField label="Protocolo" name="protocol" error={errors.protocol} required>
            <Select
              value={watch('protocol') || 'ONVIF'}
              onValueChange={(value) => setValue('protocol', value as unknown)}
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
        </TabsContent>

        {/* ABA STREAMS */}
        <TabsContent value="streams">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
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
        </TabsContent>

        {/* ABA GRAVAÇÃO */}
        <TabsContent value="gravacao">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Gravação */}
            <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Gravação</h3>

          <FormField label="Modo de Gravação" name="recordingMode" error={errors.recordingMode} required>
            <Select
              value={watch('recordingMode') || 'CONTINUOUS'}
              onValueChange={(value) => setValue('recordingMode', value as unknown)}
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
        </TabsContent>

        {/* ========================================= */}
        {/* ABA CONFIGURAÇÃO (NOVA) */}
        {/* ========================================= */}
        <TabsContent value="configuracao">
          <form onSubmit={onSubmitConfig} className="bg-white rounded-lg shadow p-6 space-y-6">

            {/* SEÇÃO 1: INFORMAÇÕES DE REDE (READ-ONLY) */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Número de série</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {camera?.hardwareInfo?.serialNumber || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Modelo</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {camera?.hardwareInfo?.manufacturer} {camera?.hardwareInfo?.model}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete()}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">IP</label>
                  <div className="mt-1 text-sm text-gray-900">{camera?.ipAddress}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Gateway</label>
                  <div className="mt-1 text-sm text-gray-900">192.168.1.1</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Máscara</label>
                  <div className="mt-1 text-sm text-gray-900">255.255.255.0</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">DNS1</label>
                  <div className="mt-1 text-sm text-gray-900">192.168.1.1</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">DNS2</label>
                  <div className="mt-1 text-sm text-gray-900">192.168.1.1</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Versão do Firmware</label>
                  <div className="mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Atualizado
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {camera?.hardwareInfo?.firmwareVersion || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <LoadingButton
                    type="button"
                    variant="outline"
                    onClick={() => lockCameraMutation.mutate(id!)}
                    isLoading={lockCameraMutation.isPending}
                    className="text-sm"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Bloquear
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm('Tem certeza que deseja reiniciar a câmera?\n\nEla ficará offline por alguns segundos.')) {
                        rebootCameraMutation.mutate(id!);
                      }
                    }}
                    isLoading={rebootCameraMutation.isPending}
                    className="text-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </LoadingButton>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: CONFIGURAR CODEC */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span>📹</span> Configurar CODEC
              </h3>

              {/* Radio buttons: Vídeo / Vídeo + Áudio */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="codecType"
                    value="VIDEO_ONLY"
                    checked={codecType === 'VIDEO_ONLY'}
                    onChange={() => setCodecType('VIDEO_ONLY')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Vídeo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="codecType"
                    value="VIDEO_AUDIO"
                    checked={codecType === 'VIDEO_AUDIO'}
                    onChange={() => setCodecType('VIDEO_AUDIO')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Vídeo + Áudio</span>
                </label>
              </div>

              {/* Grid de campos */}
              <div className="grid grid-cols-4 gap-4">
                {/* Resolução */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Resolução</label>
                  <Select value={resolution} onValueChange={(v) => setResolution(v as unknown)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CIF">CIF (352x288)</SelectItem>
                      <SelectItem value="D1">D1 (720x480)</SelectItem>
                      <SelectItem value="HD">HD (1280 x 720)</SelectItem>
                      <SelectItem value="FULL_HD">Full HD (1920x1080)</SelectItem>
                      <SelectItem value="QHD">2K QHD (2560x1440)</SelectItem>
                      <SelectItem value="UHD_4K">4K UHD (3840x2160)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Encoder */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Encoder</label>
                  <Select value={encoder} onValueChange={(v) => setEncoder(v as unknown)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="H264">H264</SelectItem>
                      <SelectItem value="H265">H265</SelectItem>
                      <SelectItem value="MJPEG">MJPEG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* FPS Frame Rate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">FPS Frame Rate</label>
                  <Input
                    type="number"
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value) || 1)}
                    min={1}
                    max={30}
                  />
                  <p className="text-xs text-gray-500">min: 1 max: 30</p>
                </div>

                {/* Frame time (calculado automaticamente) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Frame time (FPS x 2)</label>
                  <Input
                    type="number"
                    value={frameTime}
                    readOnly
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">min: 10 max: 60</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* Display OSD */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Display OSD</label>
                  <Input
                    value={displayOSD}
                    onChange={(e) => setDisplayOSD(e.target.value)}
                    placeholder="Nome exibido na tela"
                  />
                </div>

                {/* Stream */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stream</label>
                  <Select value={streamType} onValueChange={(v) => setStreamType(v as unknown)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAIN_STREAM">Main Stream</SelectItem>
                      <SelectItem value="SUB_STREAM">Sub Stream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo (Bit rate) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo (Bit rate)</label>
                  <Select value={bitRateType} onValueChange={(v) => setBitRateType(v as unknown)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBR">Constante</SelectItem>
                      <SelectItem value="VBR">Variável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bit rate */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bit rate</label>
                  <Select value={bitRate.toString()} onValueChange={(v) => setBitRate(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512Kbps</SelectItem>
                      <SelectItem value="800">800Kbps</SelectItem>
                      <SelectItem value="1024">1024Kbps</SelectItem>
                      <SelectItem value="1536">1536Kbps</SelectItem>
                      <SelectItem value="2048">2048Kbps</SelectItem>
                      <SelectItem value="3072">3072Kbps</SelectItem>
                      <SelectItem value="4096">4096Kbps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: AJUSTE DE IMAGEM */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ajuste de Imagem</h3>

              {/* Brilho */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Brilho ({brightness})
                </label>
                <Slider
                  value={[brightness]}
                  onValueChange={(value: number[]) => setBrightness(value[0])}
                  min={0}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Contraste */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contraste ({contrast})
                </label>
                <Slider
                  value={[contrast]}
                  onValueChange={(value: number[]) => setContrast(value[0])}
                  min={0}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Saturação */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Saturação ({saturation})
                </label>
                <Slider
                  value={[saturation]}
                  onValueChange={(value: number[]) => setSaturation(value[0])}
                  min={0}
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* SEÇÃO 4: CONFIGURAR IA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span>🤖</span> Configurar IA
              </h3>

              <div className="grid grid-cols-4 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={enableAI}
                    onCheckedChange={(checked: boolean) => setEnableAI(checked)}
                  />
                  <span className="text-sm text-gray-700">Configurar IA</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={recordOnMotionOnly}
                    onCheckedChange={(checked: boolean) => setRecordOnMotionOnly(checked)}
                  />
                  <span className="text-sm text-gray-700">Gravar só movimento</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={faceDetect}
                    onCheckedChange={(checked: boolean) => setFaceDetect(checked)}
                  />
                  <span className="text-sm text-gray-700">F/Detect</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={motionContours}
                    onCheckedChange={(checked: boolean) => setMotionContours(checked)}
                  />
                  <span className="text-sm text-gray-700">Contornos de movimento</span>
                </label>
              </div>
            </div>

            {/* SEÇÃO 5: INFORMAÇÃO DE DISPOSITIVO E FUSO HORÁRIO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span>📱</span> Informação de dispositivo e fuso horário
              </h3>

              <div className="grid grid-cols-4 gap-4">
                {/* Informação de dispositivo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Informação de dispositivo</label>
                  <Select value={videoStandard} onValueChange={(v) => setVideoStandard(v as unknown)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NTSC">NTSC</SelectItem>
                      <SelectItem value="PAL">PAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuso horário */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fuso horário</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {getTimezones().map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Modo de operação */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Modo de operação</label>
                  <Select value={operationMode} onValueChange={(v) => setOperationMode(v as unknown)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL_DAYS">Todos os dias</SelectItem>
                      <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Horário */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Horário</label>
                  <Input
                    type="time"
                    value={operationTime}
                    onChange={(e) => setOperationTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 6: DATA DE MANUTENÇÃO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                <span>🔧</span> Data de manutenção
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data de manutenção</label>
                <Input
                  type="date"
                  value={maintenanceDate}
                  onChange={(e) => setMaintenanceDate(e.target.value)}
                />
              </div>
            </div>

            {/* BOTÃO SALVAR */}
            <div className="flex justify-end pt-6 border-t">
              <LoadingButton type="submit" isLoading={updateConfigMutation.isPending}>
                Salvar
              </LoadingButton>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
