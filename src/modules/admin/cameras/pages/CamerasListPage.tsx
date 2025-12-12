import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCameras, 
  useDeleteCamera, 
  useTestConnection,
  useCaptureSnapshot
} from '@/hooks/useCameras';
import { CameraStatus, CameraProtocol } from '@/modules/shared/types/camera';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Eye,
  Edit, 
  Trash2, 
  Camera as CameraIcon,
  Wifi,
  WifiOff,
  AlertCircle,
  Settings,
  Image as ImageIcon
} from 'lucide-react';

export const CamerasListPage: React.FC = () => {
  const navigate = useNavigate();

  // ⚠️ Usar valores sentinel ao invés de string vazia
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL' as CameraStatus | 'ALL',
    protocol: 'ALL_PROTOCOLS' as CameraProtocol | 'ALL_PROTOCOLS',
    page: 1,
    limit: 10
  });

  // ⚠️ Converter valores sentinel para undefined no filtro
  const { data, isLoading, isError, error } = useCameras({
    ...filters,
    status: filters.status === 'ALL' ? undefined : filters.status,
    protocol: filters.protocol === 'ALL_PROTOCOLS' ? undefined : filters.protocol
  });

  const deleteMutation = useDeleteCamera();
  const testConnectionMutation = useTestConnection();
  const captureSnapshotMutation = useCaptureSnapshot();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover a câmera "${name}"?\n\nEsta ação não pode ser desfeita.`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleTestConnection = async (camera: any) => {
    await testConnectionMutation.mutateAsync({
      protocol: camera.protocol,
      ipAddress: camera.ipAddress,
      port: camera.port,
      username: camera.credentials.username,
      password: camera.credentials.password
    });
  };

  const handleCaptureSnapshot = async (id: string) => {
    await captureSnapshotMutation.mutateAsync(id);
  };

  const getStatusBadge = (status: CameraStatus) => {
    const styles = {
      ONLINE: 'bg-green-100 text-green-800 border-green-300',
      OFFLINE: 'bg-red-100 text-red-800 border-red-300',
      ERROR: 'bg-orange-100 text-orange-800 border-orange-300',
      CONFIGURING: 'bg-blue-100 text-blue-800 border-blue-300',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };

    const labels = {
      ONLINE: 'Online',
      OFFLINE: 'Offline',
      ERROR: 'Erro',
      CONFIGURING: 'Configurando',
      MAINTENANCE: 'Manutenção'
    };

    const icons = {
      ONLINE: <Wifi className="w-3 h-3" />,
      OFFLINE: <WifiOff className="w-3 h-3" />,
      ERROR: <AlertCircle className="w-3 h-3" />,
      CONFIGURING: <Settings className="w-3 h-3 animate-spin" />,
      MAINTENANCE: <Settings className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getProtocolBadge = (protocol: CameraProtocol) => {
    const styles = {
      ONVIF: 'bg-purple-100 text-purple-800',
      RTSP: 'bg-blue-100 text-blue-800',
      RTMP: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[protocol]}`}>
        {protocol}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando câmeras...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erro ao carregar câmeras</h3>
          <p className="text-sm text-red-700 mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  const cameras = data?.cameras || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Câmeras</h1>
          <p className="text-sm text-gray-600">Gerencie as câmeras do sistema</p>
        </div>
        <Button onClick={() => navigate('/admin/cameras/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Câmera
        </Button>
      </div>

      {/* Banner DEV */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-yellow-800">⚠️ Modo desenvolvimento - usando dados mockados</p>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por nome, IP ou descrição..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="pl-10"
            />
          </div>

          {/* Filtro Status - ⚠️ Usar valor sentinel 'ALL' */}
          <Select
            value={filters.status || 'ALL'}
            onValueChange={(value) => setFilters({ 
              ...filters, 
              status: value as CameraStatus | 'ALL', 
              page: 1 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="OFFLINE">Offline</SelectItem>
              <SelectItem value="ERROR">Erro</SelectItem>
              <SelectItem value="CONFIGURING">Configurando</SelectItem>
              <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro Protocolo - ⚠️ Usar valor sentinel 'ALL_PROTOCOLS' */}
          <Select
            value={filters.protocol || 'ALL_PROTOCOLS'}
            onValueChange={(value) => setFilters({ 
              ...filters, 
              protocol: value as CameraProtocol | 'ALL_PROTOCOLS', 
              page: 1 
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os protocolos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_PROTOCOLS">Todos os protocolos</SelectItem>
              <SelectItem value="ONVIF">ONVIF</SelectItem>
              <SelectItem value="RTSP">RTSP</SelectItem>
              <SelectItem value="RTMP">RTMP</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Exportar */}
          <Button variant="outline">Exportar CSV</Button>
        </div>
      </div>

      {/* Tabela */}
      {cameras.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📹</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma câmera encontrada</h3>
          <p className="text-gray-600 mb-4">Ajuste os filtros ou cadastre uma nova câmera</p>
          <Button onClick={() => navigate('/admin/cameras/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Primeira Câmera
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Câmera</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Protocolo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hardware</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cameras.map((camera) => (
                <tr key={camera.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Snapshot em miniatura */}
                      {camera.snapshotUrl ? (
                        <div className="relative group">
                          <img 
                            src={camera.snapshotUrl} 
                            alt={camera.name}
                            className="w-16 h-12 object-cover rounded border border-gray-300"
                          />
                          {/* Hover para ampliar */}
                          <div className="absolute hidden group-hover:block z-10 left-0 top-14">
                            <img 
                              src={camera.snapshotUrl} 
                              alt={camera.name}
                              className="w-64 h-48 object-cover rounded shadow-lg border-2 border-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <CameraIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {camera.name}
                          {camera.ptzCapabilities?.supportsPTZ && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-semibold" title="Suporta Pan-Tilt-Zoom">
                              PTZ
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{camera.ipAddress}:{camera.port}</div>
                        {camera.description && (
                          <div className="text-xs text-gray-400 mt-1">{camera.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{camera.tenantName}</div>
                      {camera.siteName && (
                        <div className="text-gray-500">📍 {camera.siteName}</div>
                      )}
                      {camera.areaName && (
                        <div className="text-gray-400 text-xs">{camera.areaName}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getProtocolBadge(camera.protocol)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(camera.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      {camera.hardwareInfo ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {camera.hardwareInfo.manufacturer}
                          </div>
                          <div className="text-gray-500">
                            {camera.hardwareInfo.model}
                          </div>
                          {camera.hardwareInfo.firmwareVersion && (
                            <div className="text-gray-400">
                              FW: {camera.hardwareInfo.firmwareVersion}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">Não detectado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/cameras/${camera.id}`)}
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/cameras/${camera.id}/edit`)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestConnection(camera)}
                        disabled={testConnectionMutation.isPending}
                        title="Testar Conexão"
                      >
                        <Wifi className={`w-4 h-4 text-blue-600 ${testConnectionMutation.isPending ? 'animate-pulse' : ''}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCaptureSnapshot(camera.id)}
                        disabled={captureSnapshotMutation.isPending}
                        title="Capturar Snapshot"
                      >
                        <ImageIcon className={`w-4 h-4 text-green-600 ${captureSnapshotMutation.isPending ? 'animate-pulse' : ''}`} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(camera.id, camera.name)}
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Mostrando {cameras.length} de {data.total} câmeras
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page >= data.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
