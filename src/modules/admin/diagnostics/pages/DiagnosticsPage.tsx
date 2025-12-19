import { useState } from 'react'
import { AlertCircle, Settings, Activity, Zap, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CameraLogViewer } from '../components/CameraLogViewer'
import { AiLogViewer } from '../components/AiLogViewer'
import { StreamTester } from '../components/StreamTester'
import { ProblematicCamerasList } from '../components/ProblematicCamerasList'
import {
  MOCK_CAMERA_LOGS,
  MOCK_AI_LOGS,
  MOCK_STREAM_TESTS,
  MOCK_PROBLEMATIC_CAMERAS
} from '../mockDiagnostics'

export function DiagnosticsPage() {
  const [activeTab, setActiveTab] = useState('cameras-logs')

  // Calcular stats
  const criticalErrors = MOCK_CAMERA_LOGS.filter((log) => log.level === 'error').length
  const aiWarnings = MOCK_AI_LOGS.filter((log) => log.level === 'warning').length
  const problematicCount = MOCK_PROBLEMATIC_CAMERAS.length
  const offlineCameras = MOCK_PROBLEMATIC_CAMERAS.filter((cam) => cam.status === 'offline').length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Diagnostico do Sistema</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitore logs de cameras, IA, teste streams e identifique cameras problematicas
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Erros de Camera</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{criticalErrors}</p>
              </div>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Avisos de IA</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{aiWarnings}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Cameras Offline</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{offlineCameras}</p>
              </div>
              <Activity className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Problematicas</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{problematicCount}</p>
              </div>
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cameras-logs" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Logs de Cameras</span>
          </TabsTrigger>
          <TabsTrigger value="ai-logs" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Logs de IA</span>
          </TabsTrigger>
          <TabsTrigger value="stream-test" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Teste de Stream</span>
          </TabsTrigger>
          <TabsTrigger value="problematic" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Problematicas</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Logs de Cameras */}
        <TabsContent value="cameras-logs" className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Logs de Cameras</h2>
            <p className="text-sm text-slate-600 mb-4">
              Visualize e analise os logs detalhados das cameras para diagnosticar problemas de
              conectividade, autenticacao, gravacao e outros eventos.
            </p>
          </div>
          <CameraLogViewer logs={MOCK_CAMERA_LOGS} />
        </TabsContent>

        {/* Tab: Logs de IA */}
        <TabsContent value="ai-logs" className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Logs de Processamento IA</h2>
            <p className="text-sm text-slate-600 mb-4">
              Acompanhe eventos de processamento IA, detectacoes, tempos de processamento e possveis
              erros no modulos de IA.
            </p>
          </div>
          <AiLogViewer logs={MOCK_AI_LOGS} />
        </TabsContent>

        {/* Tab: Teste de Stream */}
        <TabsContent value="stream-test" className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Teste de Stream</h2>
            <p className="text-sm text-slate-600 mb-4">
              Teste a conectividade e qualidade do stream de cada camera. Verifique resolucao,
              bitrate, FPS, latencia e URLs de acesso (RTSP/RTMP).
            </p>
          </div>
          <StreamTester results={MOCK_STREAM_TESTS} />
        </TabsContent>

        {/* Tab: Cameras Problematicas */}
        <TabsContent value="problematic" className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Cameras Problematicas</h2>
            <p className="text-sm text-slate-600 mb-4">
              Identifique e acompanhe cameras que estao com problemas como offline, erros frequentes
              ou desempenho degradado.
            </p>
          </div>
          <ProblematicCamerasList cameras={MOCK_PROBLEMATIC_CAMERAS} />
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="border-0 bg-blue-50 shadow-sm ring-1 ring-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-blue-900">
            <Settings className="h-4 w-4" />
            Dica de Diagnostico
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <ul className="list-disc list-inside space-y-1">
            <li>Verifique regularmente os logs de cameras para detectar problemas precocemente</li>
            <li>Use o teste de stream para validar configuracoes antes de colocar em producao</li>
            <li>Acompanhe as cameras problematicas e tome acoes corretivas rapidamente</li>
            <li>Analise os logs de IA para otimizar configuracoes de deteccao</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
