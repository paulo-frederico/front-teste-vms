import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSites } from '@/hooks/useSites';
import { useAreas } from '@/hooks/useAreas';
import { useDeleteSite } from '@/hooks/useSites';
import {
  getSiteTypeLabel,
  getSiteStatusLabel,
  getSiteStatusColor,
  SiteType,
  SiteStatus
} from '@/modules/shared/types/site';
import {
  getAreaTypeLabel,
  getAreaTypeIcon
} from '@/modules/shared/types/area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  MapPin,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Camera,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';

export const SitesListPage: React.FC = () => {
  const navigate = useNavigate();
  const deleteSiteMutation = useDeleteSite();

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    type: 'ALL_TYPES' as SiteType | 'ALL_TYPES',
    status: 'ALL' as SiteStatus | 'ALL'
  });

  // Sites expandidos (controle de expansão)
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set());

  // Buscar sites
  const { data: sites = [], isLoading: isLoadingSites } = useSites({
    search: filters.search || undefined,
    type: filters.type === 'ALL_TYPES' ? undefined : filters.type,
    status: filters.status === 'ALL' ? undefined : filters.status
  });

  // Buscar todas as áreas (para exibir nas expansões)
  const { data: allAreas = [] } = useAreas();

  // Toggle expansão de site
  const toggleSiteExpansion = (siteId: string) => {
    const newExpanded = new Set(expandedSites);
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId);
    } else {
      newExpanded.add(siteId);
    }
    setExpandedSites(newExpanded);
  };

  // Deletar site
  const handleDelete = async (siteId: string, siteName: string) => {
    if (window.confirm(
      `Tem certeza que deseja remover o local "${siteName}"?\n\n` +
      `Esta ação não pode ser desfeita.`
    )) {
      await deleteSiteMutation.mutateAsync(siteId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            Locais e Áreas
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie a hierarquia de locais, áreas e câmeras
          </p>
        </div>
        <Button onClick={() => navigate('/admin/sites/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Local
        </Button>
      </div>

      {/* Banner de Desenvolvimento */}
      <Alert className="bg-yellow-50 border-yellow-300">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Modo desenvolvimento</strong> - usando dados mockados
        </AlertDescription>
      </Alert>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, cidade, estado..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Filtro de Tipo */}
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_TYPES">Todos os tipos</SelectItem>
                <SelectItem value="HEADQUARTERS">Matriz</SelectItem>
                <SelectItem value="BRANCH">Filial</SelectItem>
                <SelectItem value="STORE">Loja</SelectItem>
                <SelectItem value="WAREHOUSE">Galpão/Armazém</SelectItem>
                <SelectItem value="OFFICE">Escritório</SelectItem>
                <SelectItem value="FACTORY">Fábrica</SelectItem>
                <SelectItem value="DATACENTER">Data Center</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro de Status */}
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os status</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="INACTIVE">Inativo</SelectItem>
                <SelectItem value="UNDER_CONSTRUCTION">Em Construção</SelectItem>
                <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoadingSites && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Carregando locais...</p>
        </div>
      )}

      {/* Lista de Sites */}
      {!isLoadingSites && sites.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Nenhum local encontrado</p>
            <p className="text-gray-500 text-sm mt-1">
              {filters.search || filters.type !== 'ALL_TYPES' || filters.status !== 'ALL'
                ? 'Tente ajustar os filtros'
                : 'Comece cadastrando um novo local'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cards de Sites */}
      <div className="space-y-4">
        {sites.map((site) => {
          const isExpanded = expandedSites.has(site.id);
          const siteAreas = allAreas.filter(a => a.siteId === site.id);

          return (
            <Card key={site.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-start justify-between">
                  {/* Info do Site */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Ícone de Expansão */}
                    <button
                      onClick={() => toggleSiteExpansion(site.id)}
                      className="mt-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    {/* Detalhes */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {site.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {getSiteTypeLabel(site.type)}
                        </Badge>
                        <Badge className={getSiteStatusColor(site.status)}>
                          {getSiteStatusLabel(site.status)}
                        </Badge>
                      </div>

                      {/* Endereço */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {site.address.street}, {site.address.number}
                          {site.address.complement && ` - ${site.address.complement}`}
                          {' • '}
                          {site.address.neighborhood} • {site.address.city}/{site.address.state}
                        </span>
                      </div>

                      {/* Descrição */}
                      {site.description && (
                        <p className="text-sm text-gray-600">{site.description}</p>
                      )}

                      {/* Estatísticas */}
                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            <strong className="text-gray-900">{site.totalAreas}</strong> área(s)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Camera className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            <strong className="text-gray-900">{site.totalCameras}</strong> câmera(s)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Wifi className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">
                            <strong className="text-green-600">{site.onlineCameras}</strong> online
                          </span>
                        </div>
                        {site.offlineCameras > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <WifiOff className="w-4 h-4 text-red-500" />
                            <span className="text-gray-600">
                              <strong className="text-red-600">{site.offlineCameras}</strong> offline
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/sites/${site.id}`)}
                      title="Ver detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/sites/${site.id}/edit`)}
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(site.id, site.name)}
                      disabled={deleteSiteMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Áreas (expandido) */}
              {isExpanded && (
                <CardContent className="pt-4">
                  {siteAreas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma área cadastrada neste local</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => navigate(`/admin/areas/new?siteId=${site.id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Área
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {siteAreas.map((area) => (
                        <div
                          key={area.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{getAreaTypeIcon(area.type)}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{area.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {getAreaTypeLabel(area.type)}
                                </Badge>
                              </div>
                              {area.description && (
                                <p className="text-sm text-gray-600">{area.description}</p>
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

                      {/* Botão Adicionar Área */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/admin/areas/new?siteId=${site.id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Área
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
