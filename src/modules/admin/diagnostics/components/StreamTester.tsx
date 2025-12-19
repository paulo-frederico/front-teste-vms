import { useState } from 'react'
import { Play, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { StreamTestResult, StreamTestStatus } from '../mockDiagnostics'
import { MOCK_STREAM_TESTS } from '../mockDiagnostics'

type StreamTesterProps = {
  results?: StreamTestResult[]
}

export function StreamTester({ results = MOCK_STREAM_TESTS }: StreamTesterProps) {
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [testResults, setTestResults] = useState<StreamTestResult[]>(results)
  const [isTestRunning, setIsTestRunning] = useState(false)

  const cameras = results.map((r) => ({ id: r.cameraId, name: r.cameraName }))

  const handleRunTest = async () => {
    if (!selectedCamera) return

    setIsTestRunning(true)

    // Simula o teste
    setTimeout(() => {
      const cameraResult = results.find((r) => r.cameraId === selectedCamera)
      if (cameraResult) {
        // Alterna entre sucesso e falha para demonstração
        const newStatus: StreamTestStatus =
          cameraResult.status === 'success'
            ? Math.random() > 0.7
              ? 'failed'
              : 'success'
            : Math.random() > 0.5
              ? 'success'
              : 'failed'

        const updatedResult: StreamTestResult = {
          ...cameraResult,
          status: newStatus,
          testedAt: new Date().toISOString()
        }

        setTestResults(testResults.map((r) => (r.cameraId === selectedCamera ? updatedResult : r)))
      }
      setIsTestRunning(false)
    }, 2000)
  }

  const selectedResult = testResults.find((r) => r.cameraId === selectedCamera)

  const getStatusIcon = (status: StreamTestStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'testing':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />
      case 'idle':
        return <AlertCircle className="h-5 w-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: StreamTestStatus) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'testing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: StreamTestStatus) => {
    switch (status) {
      case 'success':
        return 'Sucesso'
      case 'failed':
        return 'Falhou'
      case 'testing':
        return 'Testando...'
      case 'idle':
        return 'Nao testado'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Seletor de Camera e Botao de Teste */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Teste de Stream</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">Selecione uma Camera</label>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma camera..." />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleRunTest}
            disabled={!selectedCamera || isTestRunning}
            className="w-full"
          >
            <Play className="mr-2 h-4 w-4" />
            {isTestRunning ? 'Testando...' : 'Iniciar Teste'}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado do Teste */}
      {selectedResult && (
        <div className="space-y-4">
          {/* Status Geral */}
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Status do Teste</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{selectedResult.cameraName}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedResult.status)}
                  <Badge
                    className={`text-sm font-medium ${getStatusBadge(selectedResult.status)}`}
                  >
                    {getStatusLabel(selectedResult.status)}
                  </Badge>
                </div>
              </div>

              {selectedResult.testedAt && (
                <p className="mt-3 text-xs text-slate-500">
                  Ultimo teste:{' '}
                  {new Date(selectedResult.testedAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Detalhes do Teste - Sucesso */}
          {selectedResult.status === 'success' && (
            <div className="grid gap-4 md:grid-cols-2">
              {selectedResult.resolution && (
                <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Resolucao</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedResult.resolution}
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedResult.bitrate && (
                <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Bitrate</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedResult.bitrate}
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedResult.fps && (
                <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">FPS</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedResult.fps}
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedResult.latency && (
                <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-slate-500">Latencia</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedResult.latency}ms
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* URLs de Stream */}
          {(selectedResult.rtspUrl || selectedResult.rtmpUrl) && (
            <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">URLs de Stream</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedResult.rtspUrl && (
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">RTSP</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-slate-100 p-2 text-xs text-slate-700 break-all">
                        {selectedResult.rtspUrl}
                      </code>
                    </div>
                  </div>
                )}
                {selectedResult.rtmpUrl && (
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1">RTMP</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-slate-100 p-2 text-xs text-slate-700 break-all">
                        {selectedResult.rtmpUrl}
                      </code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Erros - Falha */}
          {selectedResult.status === 'failed' && selectedResult.errors && (
            <Card className="border-0 bg-red-50 shadow-sm ring-1 ring-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-red-900">Erros Detectados</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedResult.errors.map((error, index) => (
                    <li key={index} className="flex gap-2 text-sm text-red-800">
                      <span className="font-semibold">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
