import { useState } from 'react'
import { Plus, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog'
import { RecordingKpisHeader } from '../components/RecordingKpisHeader'
import { StoragePolicyCard } from '../components/StoragePolicyCard'
import { StoragePolicyForm } from '../components/StoragePolicyForm'
import {
  STORAGE_POLICIES,
  CAMERA_RECORDING_CONFIGS,
  buildRecordingKpis
} from '../mockRecordingPolicies'
import type { StoragePolicy } from '../types/recordingTypes'
import { RECORDING_MODE_LABELS, QUALITY_LABELS } from '../types/recordingTypes'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function RecordingPoliciesPage() {
  const [activeTab, setActiveTab] = useState('policies')
  const [policies, setPolicies] = useState(STORAGE_POLICIES)
  const [editingPolicy, setEditingPolicy] = useState<StoragePolicy | null>(null)

  const kpis = buildRecordingKpis()

  const handleSavePolicy = (updatedPolicy: StoragePolicy) => {
    setPolicies(policies.map((p) => (p.id === updatedPolicy.id ? updatedPolicy : p)))
    setEditingPolicy(null)
  }

  const handleEditPolicy = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId)
    if (policy) {
      setEditingPolicy(policy)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recording':
        return <Badge className="bg-green-100 text-green-700">Gravando</Badge>
      case 'stopped':
        return <Badge className="bg-slate-100 text-slate-600">Parado</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700">Agendado</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-700">Erro</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Politicas de Gravacao</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie modos de gravacao, retencao, armazenamento e exportacao de videos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Politica
        </Button>
      </div>

      {/* KPIs */}
      <RecordingKpisHeader kpis={kpis} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="policies">Politicas</TabsTrigger>
          <TabsTrigger value="cameras">Cameras</TabsTrigger>
          <TabsTrigger value="stats">Estatisticas</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {policies.map((policy) => (
              <StoragePolicyCard
                key={policy.id}
                policy={policy}
                onEdit={handleEditPolicy}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cameras" className="mt-6">
          <div className="space-y-3">
            {CAMERA_RECORDING_CONFIGS.map((camera) => (
              <Card key={camera.cameraId} className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Video className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {camera.cameraName}
                        </h4>
                        {getStatusBadge(camera.status)}
                      </div>
                      <p className="text-xs text-slate-500">
                        {camera.tenantName} - {camera.siteName}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-center">
                      <div>
                        <p className="text-xs text-slate-500">Modo</p>
                        <p className="text-sm font-medium text-slate-700">
                          {RECORDING_MODE_LABELS[camera.mode]}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Qualidade</p>
                        <p className="text-sm font-medium text-slate-700">{camera.quality}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Retencao</p>
                        <p className="text-sm font-medium text-slate-700">{camera.retentionDays}d</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Storage</p>
                        <p className="text-sm font-medium text-slate-700">{camera.storageUsedGB} GB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Distribuicao por Modo */}
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Distribuicao por Modo
                </h3>
                <div className="space-y-3">
                  {Object.entries(kpis.modeDistribution).map(([mode, count]) => (
                    <div key={mode} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {RECORDING_MODE_LABELS[mode as keyof typeof RECORDING_MODE_LABELS]}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${(count / kpis.totalCameras) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 w-6 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Storage por Tenant */}
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Storage por Cliente
                </h3>
                <div className="space-y-3">
                  {policies.map((policy) => {
                    const percent = Math.round((policy.usedStorageGB / policy.storageQuotaGB) * 100)
                    return (
                      <div key={policy.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600 truncate max-w-[150px]">
                            {policy.tenantName}
                          </span>
                          <span className="text-xs text-slate-500">{percent}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full ${
                              percent >= 90
                                ? 'bg-red-500'
                                : percent >= 75
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Qualidade Distribuicao */}
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Qualidade de Gravacao
                </h3>
                <div className="space-y-3">
                  {(['4K', 'FullHD', 'HD', 'SD'] as const).map((quality) => {
                    const count = CAMERA_RECORDING_CONFIGS.filter(
                      (c) => c.quality === quality
                    ).length
                    return (
                      <div key={quality} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          {QUALITY_LABELS[quality]}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de Edicao */}
      <Dialog open={!!editingPolicy} onOpenChange={(open) => !open && setEditingPolicy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingPolicy && (
            <StoragePolicyForm
              policy={editingPolicy}
              onSave={handleSavePolicy}
              onCancel={() => setEditingPolicy(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
