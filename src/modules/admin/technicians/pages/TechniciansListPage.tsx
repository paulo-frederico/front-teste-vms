import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useTechnicians, 
  useDeleteTechnician, 
  useChangeTechnicianStatus,
  useRevokeTemporaryAccess 
} from '@/hooks/useTechnicians';
import { TechnicianStatus, TechnicianSpecialty } from '@/modules/shared/types/technician';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Key,
  Clock,
  Shield
} from 'lucide-react';

export const TechniciansListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '' as TechnicianStatus | '',
    specialty: '' as TechnicianSpecialty | '',
    page: 1,
    limit: 10
  });

  const { data, isLoading, isError, error } = useTechnicians({
    search: filters.search,
    status: filters.status || undefined,
    specialty: filters.specialty || undefined,
    page: filters.page,
    limit: filters.limit
  });
  const deleteMutation = useDeleteTechnician();
  const changeStatusMutation = useChangeTechnicianStatus();
  const revokeAccessMutation = useRevokeTemporaryAccess();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o técnico "${name}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleChangeStatus = async (id: string, status: TechnicianStatus) => {
    await changeStatusMutation.mutateAsync({ id, status });
  };

  const handleRevokeAccess = async (accessId: string, technicianName: string) => {
    if (window.confirm(`Tem certeza que deseja REVOGAR o acesso temporário de "${technicianName}"?\n\nO técnico será desconectado imediatamente.`)) {
      await revokeAccessMutation.mutateAsync(accessId);
    }
  };

  const getStatusBadge = (status: TechnicianStatus) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800'
    };

    const labels = {
      ACTIVE: 'Ativo',
      INACTIVE: 'Inativo',
      SUSPENDED: 'Suspenso'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getSpecialtyBadge = (specialty: TechnicianSpecialty) => {
    const styles = {
      INSTALLATION: 'bg-blue-100 text-blue-800',
      NETWORK: 'bg-purple-100 text-purple-800',
      ONVIF_CONFIG: 'bg-indigo-100 text-indigo-800',
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      TROUBLESHOOTING: 'bg-red-100 text-red-800',
      ALL: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      INSTALLATION: 'Instalação',
      NETWORK: 'Redes',
      ONVIF_CONFIG: 'ONVIF',
      MAINTENANCE: 'Manutenção',
      TROUBLESHOOTING: 'Suporte',
      ALL: 'Todas'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[specialty]}`}>
        {labels[specialty]}
      </span>
    );
  };

  const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expirado';

    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 60) {
      return `${diffMinutes}min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando técnicos...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erro ao carregar técnicos</h3>
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

  const technicians = data?.technicians || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Técnicos / Instaladores</h1>
          <p className="text-sm text-gray-600">Gerencie os técnicos e seus acessos temporários</p>
        </div>
        <Button onClick={() => navigate('/admin/technicians/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Técnico
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
              placeholder="Buscar por nome, email ou região..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="pl-10"
            />
          </div>

          {/* Filtro Status */}
          <Select
            value={filters.status || 'ALL'}
            onValueChange={(value) => setFilters({ ...filters, status: value === 'ALL' ? '' : value as TechnicianStatus, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="INACTIVE">Inativo</SelectItem>
              <SelectItem value="SUSPENDED">Suspenso</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro Especialidade */}
          <Select
            value={filters.specialty || 'ALL_SPECIALTIES'}
            onValueChange={(value) => setFilters({ ...filters, specialty: value === 'ALL_SPECIALTIES' || value === 'ALL' ? '' : value as TechnicianSpecialty, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as especialidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_SPECIALTIES">Todas</SelectItem>
              <SelectItem value="INSTALLATION">Instalação</SelectItem>
              <SelectItem value="NETWORK">Redes</SelectItem>
              <SelectItem value="ONVIF_CONFIG">ONVIF</SelectItem>
              <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
              <SelectItem value="TROUBLESHOOTING">Suporte</SelectItem>
              <SelectItem value="ALL">Todas</SelectItem>
            </SelectContent>
          </Select>

          {/* Botão Exportar */}
          <Button variant="outline">Exportar CSV</Button>
        </div>
      </div>

      {/* Tabela */}
      {technicians.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">🔧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum técnico encontrado</h3>
          <p className="text-gray-600 mb-4">Ajuste os filtros ou cadastre um novo técnico</p>
          <Button onClick={() => navigate('/admin/technicians/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Primeiro Técnico
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estatísticas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acesso</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {technicians.map((technician) => (
                <tr key={technician.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                      <div className="text-sm text-gray-500">{technician.email}</div>
                      <div className="text-xs text-gray-400">{technician.phone}</div>
                      {technician.region && (
                        <div className="text-xs text-gray-400 mt-1">📍 {technician.region}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getSpecialtyBadge(technician.specialty)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(technician.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Instalações:</span>
                        <span className="font-medium">{technician.stats?.totalInstallations || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Manutenções:</span>
                        <span className="font-medium">{technician.stats?.totalMaintenances || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Avaliação:</span>
                        <span className="font-medium text-yellow-600">
                          ⭐ {technician.stats?.averageRating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {technician.currentAccess ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Acesso Ativo</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-600" />
                          <span className="text-xs text-orange-700">
                            Expira em {getTimeRemaining(technician.currentAccess.expiresAt)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]" title={technician.currentAccess.tenantName}>
                          Cliente: {technician.currentAccess.tenantName}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sem acesso</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/technicians/${technician.id}/edit`)}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      {/* Botão Conceder/Revogar Acesso */}
                      {technician.currentAccess ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeAccess(technician.currentAccess!.id, technician.name)}
                          title="Revogar Acesso Temporário"
                        >
                          <Shield className="w-4 h-4 text-red-600" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/technicians/${technician.id}/grant-access`)}
                          title="Conceder Acesso Temporário"
                        >
                          <Key className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}

                      {/* Botão Inativar/Ativar */}
                      {technician.status === TechnicianStatus.ACTIVE ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleChangeStatus(technician.id, TechnicianStatus.INACTIVE)}
                          title="Inativar"
                        >
                          <Ban className="w-4 h-4 text-orange-600" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleChangeStatus(technician.id, TechnicianStatus.ACTIVE)}
                          title="Ativar"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(technician.id, technician.name)}
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
            Mostrando {technicians.length} de {data.total} técnicos
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
