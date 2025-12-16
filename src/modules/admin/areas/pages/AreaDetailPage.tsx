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

      {/* Card: Câmeras (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Câmeras ({area.totalCameras})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">
              Listagem de câmeras será implementada em breve
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
