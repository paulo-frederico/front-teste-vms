import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useArea, useDeleteArea } from '@/hooks/useAreas';
import {
  getAreaTypeLabel,
  getAreaStatusLabel,
  getAreaStatusColor,
  getAreaTypeIcon,
} from '@/modules/shared/types/area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Pencil,
  Trash2,
  Camera,
  Wifi,
  WifiOff,
  AlertCircle,
  Ruler,
  Users,
  Video,
  Settings,
  Eye,
} from 'lucide-react';

export const AreaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteAreaMutation = useDeleteArea();

  // Buscar área
  const { data: area, isLoading } = useArea(id!);

  const handleDelete = async () => {
    if (!area) return;

    if (
      window.confirm(
        `Tem certeza que deseja remover a área "${area.name}"?\n\n` +
          `Esta ação não pode ser desfeita.`
      )
    ) {
      await deleteAreaMutation.mutateAsync(area.id);
      navigate('/admin/sites');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando área...</p>
        </div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Área não encontrada</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/sites')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-4xl">
                {getAreaTypeIcon(area.type)}
              </span>
              {area.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {area.siteName} • {area.tenantName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/areas/${area.id}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAreaMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3">
        <Badge variant="outline">{getAreaTypeLabel(area.type)}</Badge>
        <Badge className={getAreaStatusColor(area.status)}>
          {getAreaStatusLabel(area.status)}
        </Badge>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card: Informações Básicas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {area.description && (
              <div>
                <p className="text-sm font-medium text-gray-700">Descrição</p>
                <p className="text-gray-900">{area.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Local</p>
              <div className="flex items-start gap-2 text-gray-900">
                <Building2 className="w-4 h-4 mt-1 text-gray-400" />
                <div>
                  <p className="font-medium">{area.siteName}</p>
                  <p className="text-sm text-gray-600">{area.tenantName}</p>
                </div>
              </div>
            </div>

            {(area.floor || area.capacity || area.squareMeters) && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Características
                </p>
                <div className="space-y-2">
                  {area.floor && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Andar:</span>
                      <span className="text-gray-900">{area.floor}</span>
                    </div>
                  )}
                  {area.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Capacidade:</span>
                      <span className="text-gray-900">
                        {area.capacity} pessoas
                      </span>
                    </div>
                  )}
                  {area.squareMeters && (
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Área:</span>
                      <span className="text-gray-900">{area.squareMeters} m²</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card: Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Câmeras</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {area.totalCameras}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {area.onlineCameras}
              </span>
            </div>

            {area.offlineCameras > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Offline</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {area.offlineCameras}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card: Câmeras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Câmeras ({area.totalCameras})
          </CardTitle>
          <Button size="sm" variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Adicionar câmera
          </Button>
        </CardHeader>
        <CardContent>
          {area.totalCameras === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">Nenhuma câmera cadastrada nesta área</p>
              <Button size="sm" variant="outline" className="mt-4">
                Adicionar primeira câmera
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Câmera</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Gerar câmeras mockadas baseado no total */}
                  {Array.from({ length: Math.min(area.totalCameras, 5) }).map((_, idx) => {
                    const isOnline = idx < area.onlineCameras;
                    const models = ['Hikvision DS-2CD2143', 'Intelbras VIP 3260', 'Dahua IPC-HFW2431S', 'Axis P3245-V', 'Hanwha XNV-6080'];
                    const aiModules = [['Intrusão'], ['LPR'], ['Contagem'], ['EPI'], []];
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded bg-gray-100">
                              <Video className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">CAM-{String(idx + 1).padStart(3, '0')}</p>
                              <p className="text-xs text-gray-500">{area.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {models[idx % models.length]}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                          192.168.1.{100 + idx}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                            isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-1">
                            {aiModules[idx % aiModules.length].length > 0 ? (
                              aiModules[idx % aiModules.length].map((ai, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                                  {ai}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {area.totalCameras > 5 && (
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <Button variant="link" size="sm">
                    Ver todas as {area.totalCameras} câmeras
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
