import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmins, useDeleteAdmin, useChangeAdminStatus, useResetAdminPassword } from '@/hooks/useAdmins';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Ban, CheckCircle, Key } from 'lucide-react';

export const AdminsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: undefined as 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | undefined,
    page: 1,
    limit: 10
  });

  const { data, isLoading, isError, error } = useAdmins(filters);
  const deleteMutation = useDeleteAdmin();
  const changeStatusMutation = useChangeAdminStatus();
  const resetPasswordMutation = useResetAdminPassword();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover o admin "${name}"?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleChangeStatus = async (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    await changeStatusMutation.mutateAsync({ id, status });
  };

  const handleResetPassword = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja resetar a senha de "${name}"?\nUma nova senha será enviada por email.`)) {
      await resetPasswordMutation.mutateAsync(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-red-100 text-red-800',
      INACTIVE: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      ACTIVE: 'Ativo',
      SUSPENDED: 'Suspenso',
      INACTIVE: 'Inativo'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando admins...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erro ao carregar admins</h3>
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

  const admins = data?.admins || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administradores</h1>
          <p className="text-sm text-gray-600">Gerencie os administradores do sistema</p>
        </div>
        <Button onClick={() => navigate('/admin/admins/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Admin
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status || 'ALL'}
            onValueChange={(value: string) => setFilters({ ...filters, status: value === 'ALL' ? undefined : value as 'ACTIVE' | 'SUSPENDED' | 'INACTIVE', page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="SUSPENDED">Suspenso</SelectItem>
              <SelectItem value="INACTIVE">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">Exportar CSV</Button>
        </div>
      </div>

      {/* Tabela */}
      {admins.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum admin encontrado</h3>
          <p className="text-gray-600 mb-4">Ajuste os filtros ou crie um novo admin</p>
          <Button onClick={() => navigate('/admin/admins/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Admin
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado Por</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                    {admin.phone && <div className="text-xs text-gray-400">{admin.phone}</div>}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(admin.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('pt-BR') : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{admin.createdByName}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/admins/${admin.id}/edit`)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleResetPassword(admin.id, admin.name)} title="Resetar Senha">
                        <Key className="w-4 h-4 text-blue-600" />
                      </Button>
                      {admin.status === 'ACTIVE' ? (
                        <Button variant="ghost" size="sm" onClick={() => handleChangeStatus(admin.id, 'SUSPENDED')} title="Suspender">
                          <Ban className="w-4 h-4 text-orange-600" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleChangeStatus(admin.id, 'ACTIVE')} title="Reativar">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(admin.id, admin.name)} title="Remover">
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
          <div className="text-sm text-gray-700">Mostrando {admins.length} de {data.total} admins</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={filters.page === 1}>
              Anterior
            </Button>
            <Button variant="outline" onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page >= data.totalPages}>
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
