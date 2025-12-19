import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Camera, Settings, BarChart3 } from 'lucide-react'

import { AiConfigKpisHeader } from '../components/AiConfigKpisHeader'
import { CameraAiConfigTable } from '../components/CameraAiConfigTable'
import { GlobalAiConfigPanel } from '../components/GlobalAiConfigPanel'
import {
  CAMERA_AI_CONFIGS,
  GLOBAL_AI_CONFIGS,
  buildAiConfigKpis
} from '../mockAiConfig'
import type { GlobalAiConfig } from '../types/aiConfigTypes'

export function AiConfigPage() {
  const [activeTab, setActiveTab] = useState('cameras')
  const [globalConfigs, setGlobalConfigs] = useState(GLOBAL_AI_CONFIGS)

  const kpis = buildAiConfigKpis()

  const handleSaveGlobalConfig = (updatedConfig: GlobalAiConfig) => {
    setGlobalConfigs(
      globalConfigs.map((c) => (c.id === updatedConfig.id ? updatedConfig : c))
    )
  }

  // Usar a primeira config global como exemplo (poderia ser selecionavel por tenant)
  const selectedGlobalConfig = globalConfigs[0]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Configuracao de IA</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie modulos de inteligencia artificial, sensibilidade e zonas de deteccao
        </p>
      </div>

      {/* KPIs */}
      <AiConfigKpisHeader kpis={kpis} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="cameras" className="gap-2">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Cameras</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Config. Global</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Estatisticas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cameras" className="mt-6">
          <CameraAiConfigTable configs={CAMERA_AI_CONFIGS} />
        </TabsContent>

        <TabsContent value="global" className="mt-6">
          <GlobalAiConfigPanel
            config={selectedGlobalConfig}
            onSave={handleSaveGlobalConfig}
          />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Modulos Mais Usados */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Modulos Mais Usados
              </h3>
              <div className="space-y-3">
                {Object.entries(kpis.moduleCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([module, count]) => (
                    <div key={module} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 capitalize">
                        {module.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${(count / Math.max(...Object.values(kpis.moduleCounts))) * 100}%`
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
            </div>

            {/* Resumo por Tenant */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Cameras por Cliente
              </h3>
              <div className="space-y-3">
                {Array.from(
                  new Set(CAMERA_AI_CONFIGS.map((c) => c.tenantName))
                ).map((tenant) => {
                  const count = CAMERA_AI_CONFIGS.filter(
                    (c) => c.tenantName === tenant
                  ).length
                  return (
                    <div key={tenant} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 truncate max-w-[150px]">
                        {tenant}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {count} {count === 1 ? 'camera' : 'cameras'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Distribuicao de Sensibilidade */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Distribuicao de Sensibilidade
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Baixa (0-30%)', range: [0, 30], color: 'bg-green-500' },
                  { label: 'Media (31-60%)', range: [31, 60], color: 'bg-yellow-500' },
                  { label: 'Alta (61-80%)', range: [61, 80], color: 'bg-orange-500' },
                  { label: 'Muito Alta (81-100%)', range: [81, 100], color: 'bg-red-500' }
                ].map((level) => {
                  const count = CAMERA_AI_CONFIGS.filter(
                    (c) =>
                      c.globalSensitivity >= level.range[0] &&
                      c.globalSensitivity <= level.range[1]
                  ).length
                  return (
                    <div key={level.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${level.color}`} />
                        <span className="text-sm text-slate-600">{level.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
