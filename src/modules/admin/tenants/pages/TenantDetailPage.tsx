import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenants';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Ban, CheckCircle, Trash2, Users, Camera, Video, HardDrive, Activity, TrendingUp, AlertTriangle, Clock } from 'lucide-react';

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
        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Usuários do Cliente</h2>
            <Button size="sm" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Adicionar usuário
            </Button>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perfil</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último acesso</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Maria Silva', email: 'maria@empresa.com', role: 'Cliente Master', status: 'Ativo', lastLogin: '2h atrás' },
                  { name: 'João Santos', email: 'joao@empresa.com', role: 'Operador', status: 'Ativo', lastLogin: '1d atrás' },
                  { name: 'Ana Costa', email: 'ana@empresa.com', role: 'Visualizador', status: 'Ativo', lastLogin: '5h atrás' },
                  { name: 'Pedro Lima', email: 'pedro@empresa.com', role: 'Operador', status: 'Suspenso', lastLogin: '30d atrás' },
                ].map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ABA CÂMERAS */}
        <TabsContent value="cameras" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Câmeras do Cliente</h2>
            <Button size="sm" variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Adicionar câmera
            </Button>
          </div>

          {/* KPIs de Câmeras */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tenant.stats?.activeCameras || 0}</p>
                    <p className="text-xs text-gray-500">Total de câmeras</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Video className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{Math.floor((tenant.stats?.activeCameras || 0) * 0.85)}</p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{Math.floor((tenant.stats?.activeCameras || 0) * 0.1)}</p>
                    <p className="text-xs text-gray-500">Offline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{Math.floor((tenant.stats?.activeCameras || 0) * 0.05)}</p>
                    <p className="text-xs text-gray-500">Em manutenção</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Câmeras */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Câmera</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IA Ativa</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'CAM-001 Entrada Principal', location: 'Matriz', model: 'Hikvision DS-2CD2143', status: 'online', ai: ['LPR', 'Intrusão'] },
                  { name: 'CAM-002 Estacionamento', location: 'Matriz', model: 'Intelbras VIP 3260', status: 'online', ai: ['Contagem'] },
                  { name: 'CAM-003 Recepção', location: 'Matriz', model: 'Hikvision DS-2CD2143', status: 'online', ai: [] },
                  { name: 'CAM-004 Depósito', location: 'Filial Norte', model: 'Dahua IPC-HFW2431S', status: 'offline', ai: ['Intrusão'] },
                  { name: 'CAM-005 Área de Carga', location: 'Filial Norte', model: 'Axis P3245-V', status: 'maintenance', ai: ['EPI'] },
                ].map((cam, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cam.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cam.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cam.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        cam.status === 'online' ? 'bg-green-100 text-green-800' :
                        cam.status === 'offline' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cam.status === 'online' ? 'Online' : cam.status === 'offline' ? 'Offline' : 'Manutenção'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {cam.ai.length > 0 ? cam.ai.map((module, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">{module}</span>
                        )) : <span className="text-xs text-gray-400">Nenhuma</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ABA ESTATÍSTICAS */}
        <TabsContent value="estatisticas" className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">98.5%</p>
                    <p className="text-xs text-gray-500">Uptime (30d)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-xs text-gray-500">Eventos IA (7d)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <HardDrive className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tenant.stats?.storageUsedGB || 0}GB</p>
                    <p className="text-xs text-gray-500">Storage usado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-xs text-gray-500">Alertas críticos (7d)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos placeholder */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Eventos por Tipo de IA</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Intrusão', value: 45, color: 'bg-red-500' },
                    { label: 'LPR / Placas', value: 30, color: 'bg-purple-500' },
                    { label: 'Contagem', value: 15, color: 'bg-blue-500' },
                    { label: 'EPI', value: 10, color: 'bg-green-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-24">{item.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-8">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Uso de Storage (últimos 30 dias)</h3>
                <div className="flex items-end justify-between h-32 gap-1">
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const height = 20 + Math.random() * 80;
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-blue-400 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>1</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo de uso */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Resumo de Consumo</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Câmeras</span>
                    <span className="font-medium">{tenant.stats?.activeCameras || 0} / {tenant.limits.maxCameras}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${((tenant.stats?.activeCameras || 0) / tenant.limits.maxCameras) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium">{tenant.stats?.storageUsedGB || 0}GB / {tenant.limits.storageGB}GB</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${((tenant.stats?.storageUsedGB || 0) / tenant.limits.storageGB) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Usuários</span>
                    <span className="font-medium">{tenant.stats?.users || 0} / {tenant.limits.maxUsers}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${((tenant.stats?.users || 0) / tenant.limits.maxUsers) * 100}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
