import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useCamera, 
  useDeleteCamera, 
  useTestConnection,
  useCaptureSnapshot,
  useCameraStats
} from '@/hooks/useCameras';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingButton } from '@/components/form/LoadingButton';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Wifi,
  Image as ImageIcon,
  Camera as CameraIcon,
  HardDrive,
  Activity
} from 'lucide-react';

export const CameraDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: camera, isLoading } = useCamera(id!);
  const { data: stats } = useCameraStats(id!);
  const deleteMutation = useDeleteCamera();
  const testConnectionMutation = useTestConnection();
  const captureSnapshotMutation = useCaptureSnapshot();

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja remover a câmera "${camera?.name}"?\n\nEsta ação não pode ser desfeita.`)) {
      await deleteMutation.mutateAsync(id!);
      navigate('/admin/cameras');
    }
  };

  const handleTestConnection = async () => {
    if (!camera) return;
    await testConnectionMutation.mutateAsync({
      protocol: camera.protocol,
      ipAddress: camera.ipAddress,
      port: camera.port,
      username: camera.credentials.username,
      password: camera.credentials.password
    });
  };

  const handleCaptureSnapshot = async () => {
    await captureSnapshotMutation.mutateAsync(id!);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Câmera não encontrada
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ONLINE: 'text-green-600',
      OFFLINE: 'text-red-600',
      ERROR: 'text-orange-600',
      CONFIGURING: 'text-blue-600',
      MAINTENANCE: 'text-yellow-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/cameras')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {camera.name}
              {camera.ptzCapabilities?.supportsPTZ && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded font-semibold">
                  PTZ
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-600">
              {camera.ipAddress}:{camera.port} • {camera.protocol}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <LoadingButton
            variant="outline"
            onClick={handleTestConnection}
            isLoading={testConnectionMutation.isPending}
          >
            <Wifi className="w-4 h-4 mr-2" />
            Testar Conexão
          </LoadingButton>

          <LoadingButton
            variant="outline"
            onClick={handleCaptureSnapshot}
            isLoading={captureSnapshotMutation.isPending}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Capturar Snapshot
          </LoadingButton>

          <Button variant="outline" onClick={() => navigate(`/admin/cameras/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>

          <Button 
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>

      {/* Status e Estatísticas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-2xl font-bold ${getStatusColor(camera.status)}`}>
                {camera.status}
              </p>
            </div>
            <Activity className={`w-8 h-8 ${getStatusColor(camera.status)}`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.uptime || 0}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Eventos</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalEvents || 0}
              </p>
            </div>
            <CameraIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.storageUsedGB || 0}GB
              </p>
            </div>
            <HardDrive className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Abas */}
      <Tabs defaultValue="geral" className="w-full">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="stream">Stream</TabsTrigger>
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="gravacao">Gravação</TabsTrigger>
        </TabsList>

        {/* ABA GERAL */}
        <TabsContent value="geral" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Protocolo</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.protocol}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.tenantName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Local</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.siteName || 'Não definido'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Área</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.areaName || 'Não definida'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Instalado por</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.installedByName || 'N/A'}</dd>
              </div>
            </dl>

            {camera.description && (
              <div className="mt-4 pt-4 border-t">
                <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.description}</dd>
              </div>
            )}
          </div>

          {/* Snapshot */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Snapshot Atual</h2>
            {camera.snapshotUrl ? (
              <img 
                src={camera.snapshotUrl} 
                alt={camera.name}
                className="w-full h-auto rounded-lg border border-gray-300"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CameraIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum snapshot disponível</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ABA STREAM */}
        <TabsContent value="stream" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Preview do Stream</h2>
            <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <CameraIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Preview de Stream</p>
                <p className="text-sm opacity-75 mt-2">Funcionalidade será implementada em breve</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Perfis de Stream</h2>
            <div className="space-y-4">
              {camera.streamProfiles.map((profile) => (
                <div key={profile.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{profile.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {profile.quality}
                    </span>
                  </div>
                  <dl className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Resolução</dt>
                      <dd className="font-medium">{profile.resolution}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">FPS</dt>
                      <dd className="font-medium">{profile.fps}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Bitrate</dt>
                      <dd className="font-medium">{profile.bitrate} Kbps</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Codec</dt>
                      <dd className="font-medium">{profile.codec}</dd>
                    </div>
                  </dl>
                  {profile.url && (
                    <div className="mt-2 pt-2 border-t">
                      <dt className="text-xs text-gray-500">URL</dt>
                      <dd className="text-xs font-mono text-gray-700 break-all">{profile.url}</dd>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ABA HARDWARE */}
        <TabsContent value="hardware" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informações de Hardware</h2>
            {camera.hardwareInfo ? (
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fabricante</dt>
                  <dd className="mt-1 text-sm text-gray-900">{camera.hardwareInfo.manufacturer}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Modelo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{camera.hardwareInfo.model}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Firmware</dt>
                  <dd className="mt-1 text-sm text-gray-900">{camera.hardwareInfo.firmwareVersion}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Número de Série</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">{camera.hardwareInfo.serialNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">MAC Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{camera.hardwareInfo.macAddress}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500">Hardware não detectado</p>
            )}
          </div>

          {camera.ptzCapabilities && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Capacidades PTZ</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Suporta PTZ</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {camera.ptzCapabilities.supportsPTZ ? '✅ Sim' : '❌ Não'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Pan (Horizontal)</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {camera.ptzCapabilities.canPan ? '✅ Sim' : '❌ Não'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tilt (Vertical)</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {camera.ptzCapabilities.canTilt ? '✅ Sim' : '❌ Não'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Zoom</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {camera.ptzCapabilities.canZoom ? '✅ Sim' : '❌ Não'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Presets</dt>
                  <dd className="mt-1 text-sm text-gray-900">{camera.ptzCapabilities.presets}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tours</dt>
                  <dd className="mt-1 text-sm text-gray-900">{camera.ptzCapabilities.tours}</dd>
                </div>
              </dl>
            </div>
          )}
        </TabsContent>

        {/* ABA GRAVAÇÃO */}
        <TabsContent value="gravacao" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Configurações de Gravação</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Modo de Gravação</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.recordingMode}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Retenção</dt>
                <dd className="mt-1 text-sm text-gray-900">{camera.retentionDays} dias</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Storage Usado</dt>
                <dd className="mt-1 text-sm text-gray-900">{stats?.storageUsedGB || 0} GB</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Bitrate Médio</dt>
                <dd className="mt-1 text-sm text-gray-900">{stats?.averageBitrate || 0} Kbps</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Módulos de IA Habilitados</h2>
            {camera.enabledAIModules.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {camera.enabledAIModules.map((module) => (
                  <span key={module} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {module}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum módulo de IA habilitado</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
