import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenants';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Ban, CheckCircle, Trash2 } from 'lucide-react';

export const TenantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading } = useTenant(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Cliente não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/tenants')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            <p className="text-sm text-gray-600">{tenant.fiscalData.cnpj}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/tenants/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          {tenant.status === 'ACTIVE' ? (
            <Button variant="outline">
              <Ban className="w-4 h-4 mr-2" />
              Suspender
            </Button>
          ) : (
            <Button variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Reativar
            </Button>
          )}
          <Button variant="outline" className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </div>

      {/* Abas */}
      <Tabs defaultValue="geral" className="w-full">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="cameras">Câmeras</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
        </TabsList>

        {/* ABA GERAL */}
        <TabsContent value="geral" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informações Gerais</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Plano</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.plan}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    tenant.status === 'TRIAL' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tenant.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data de Contrato</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(tenant.contractDate).toLocaleDateString('pt-BR')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Data de Expiração</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(tenant.expirationDate).toLocaleDateString('pt-BR')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Dados Fiscais</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Razão Social</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.fiscalData.companyName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.fiscalData.cnpj}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {tenant.fiscalData.address.street}, {tenant.fiscalData.address.number}
                  {tenant.fiscalData.address.complement && `, ${tenant.fiscalData.address.complement}`}
                  <br />
                  {tenant.fiscalData.address.neighborhood} - {tenant.fiscalData.address.city}/{tenant.fiscalData.address.state}
                  <br />
                  CEP: {tenant.fiscalData.address.zipCode}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Contato Principal</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nome</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.primaryContact.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Cargo</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.primaryContact.position || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.primaryContact.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.primaryContact.phone}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Limites</h2>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Câmeras</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {tenant.stats?.activeCameras || 0} / {tenant.limits.maxCameras}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sites</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {tenant.stats?.sites || 0} / {tenant.limits.maxSites}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Usuários</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {tenant.stats?.users || 0} / {tenant.limits.maxUsers}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Retenção</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.limits.retentionDays} dias</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Storage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {tenant.stats?.storageUsedGB || 0}GB / {tenant.limits.storageGB}GB
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Qualidade Máxima</dt>
                <dd className="mt-1 text-sm text-gray-900">{tenant.limits.maxStreamQuality}</dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        {/* ABA USUÁRIOS */}
        <TabsContent value="usuarios">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Lista de usuários será implementada em breve</p>
          </div>
        </TabsContent>

        {/* ABA CÂMERAS */}
        <TabsContent value="cameras">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Lista de câmeras será implementada em breve</p>
          </div>
        </TabsContent>

        {/* ABA ESTATÍSTICAS */}
        <TabsContent value="estatisticas">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Estatísticas serão implementadas em breve</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
