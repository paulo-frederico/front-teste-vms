import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSite, useDeleteSite } from '@/hooks/useSites';
import { useAreas } from '@/hooks/useAreas';
import {
  getSiteTypeLabel,
  getSiteStatusLabel,
  getSiteStatusColor,
} from '@/modules/shared/types/site';
import {
  getAreaTypeLabel,
  getAreaTypeIcon,
} from '@/modules/shared/types/area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Building2,
  MapPin,
  User,
  Pencil,
  Trash2,
  Camera,
  Wifi,
  WifiOff,
  AlertCircle,
  Plus,
  Eye,
} from 'lucide-react';

export const SiteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteSiteMutation = useDeleteSite();

  // Buscar site
  const { data: site, isLoading } = useSite(id!);

  // Buscar áreas do site
  const { data: areas = [] } = useAreas({ siteId: id });

  const handleDelete = async () => {
    if (!site) return;

    if (
      window.confirm(
        `Tem certeza que deseja remover o local "${site.name}"?\n\n` +
          `Esta ação não pode ser desfeita.`
      )
    ) {
      await deleteSiteMutation.mutateAsync(site.id);
      navigate('/admin/sites');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando local...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Local não encontrado</AlertDescription>
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
              <Building2 className="w-8 h-8 text-blue-600" />
              {site.name}
            </h1>
            <p className="text-gray-600 mt-1">{site.tenantName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/sites/${site.id}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSiteMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3">
        <Badge variant="outline">{getSiteTypeLabel(site.type)}</Badge>
        <Badge className={getSiteStatusColor(site.status)}>
          {getSiteStatusLabel(site.status)}
        </Badge>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card: Informações Básicas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {site.description && (
              <div>
                <p className="text-sm font-medium text-gray-700">Descrição</p>
                <p className="text-gray-900">{site.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Endereço</p>
              <div className="flex items-start gap-2 text-gray-900">
                <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                <div>
                  <p>{site.address.street}, {site.address.number}</p>
                  {site.address.complement && <p>{site.address.complement}</p>}
                  <p>{site.address.neighborhood}</p>
                  <p>{site.address.city}/{site.address.state} - CEP {site.address.zipCode}</p>
                </div>
              </div>
            </div>

            {(site.contactName || site.contactPhone || site.contactEmail) && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Contato</p>
                <div className="flex items-start gap-2 text-gray-900">
                  <User className="w-4 h-4 mt-1 text-gray-400" />
                  <div>
                    {site.contactName && <p>{site.contactName}</p>}
                    {site.contactPhone && <p>{site.contactPhone}</p>}
                    {site.contactEmail && <p>{site.contactEmail}</p>}
                  </div>
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
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Áreas</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {site.totalAreas}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Câmeras</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {site.totalCameras}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {site.onlineCameras}
              </span>
            </div>

            {site.offlineCameras > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Offline</span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {site.offlineCameras}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card: Áreas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Áreas ({areas.length})
            </CardTitle>
            <Button
              size="sm"
              onClick={() => navigate(`/admin/areas/new?siteId=${site.id}`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Área
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {areas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">Nenhuma área cadastrada neste local</p>
            </div>
          ) : (
            <div className="space-y-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">
                      {getAreaTypeIcon(area.type)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {area.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {getAreaTypeLabel(area.type)}
                        </Badge>
                      </div>
                      {area.description && (
                        <p className="text-sm text-gray-600">
                          {area.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        {area.floor && (
                          <span className="text-xs text-gray-500">
                            📍 {area.floor}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          <Camera className="w-3 h-3 inline mr-1" />
                          {area.totalCameras} câmera(s)
                        </span>
                        <span className="text-xs text-green-600">
                          <Wifi className="w-3 h-3 inline mr-1" />
                          {area.onlineCameras} online
                        </span>
                        {area.offlineCameras > 0 && (
                          <span className="text-xs text-red-600">
                            <WifiOff className="w-3 h-3 inline mr-1" />
                            {area.offlineCameras} offline
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/areas/${area.id}`)}
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/areas/${area.id}/edit`)}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
