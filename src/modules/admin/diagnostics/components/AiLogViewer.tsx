import { useState, useMemo } from 'react'
import { AlertCircle, Info, AlertTriangle, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { AiLog, AiLogLevel } from '../mockDiagnostics'
import { MOCK_AI_LOGS } from '../mockDiagnostics'

const AI_MODULES = [
  'Intrusao',
  'Linha Virtual',
  'LPR',
  'Contagem de Pessoas',
  'Contagem de Veiculos',
  'Loitering',
  'EPI'
]

type AiLogViewerProps = {
  logs?: AiLog[]
}

export function AiLogViewer({ logs = MOCK_AI_LOGS }: AiLogViewerProps) {
  const [levelFilter, setLevelFilter] = useState<AiLogLevel | 'ALL'>('ALL')
  const [moduleFilter, setModuleFilter] = useState('ALL')
  const [cameraFilter, setCameraFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  const cameras = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.cameraName))).sort()
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter
      const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter
      const matchesCamera = cameraFilter === 'ALL' || log.cameraName === cameraFilter
      const matchesSearch =
        searchText === '' ||
        log.message.toLowerCase().includes(searchText.toLowerCase()) ||
        log.cameraName.toLowerCase().includes(searchText.toLowerCase())

      return matchesLevel && matchesModule && matchesCamera && matchesSearch
    })
  }, [logs, levelFilter, moduleFilter, cameraFilter, searchText])

  const getLogIcon = (level: AiLogLevel) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'info':
        return <Zap className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getLogBadgeVariant = (level: AiLogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-orange-100 text-orange-800'
      case 'info':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = useMemo(() => {
    return {
      total: filteredLogs.length,
      errors: filteredLogs.filter((l) => l.level === 'error').length,
      warnings: filteredLogs.filter((l) => l.level === 'warning').length,
      avgProcessingTime:
        filteredLogs.length > 0
          ? Math.round(
              filteredLogs.reduce((sum, l) => sum + (l.processingTime || 0), 0) / filteredLogs.length
            )
          : 0,
      totalDetections: filteredLogs.reduce((sum, l) => sum + (l.detections || 0), 0)
    }
  }, [filteredLogs])

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">
                Nivel de Log
              </label>
              <Select value={levelFilter} onValueChange={(value: any) => setLevelFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os niveis</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Modulo IA</label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os modulos</SelectItem>
                  {AI_MODULES.map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Camera</label>
              <Select value={cameraFilter} onValueChange={setCameraFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as cameras</SelectItem>
                  {cameras.map((camera) => (
                    <SelectItem key={camera} value={camera}>
                      {camera}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-500">Buscar</label>
              <Input
                placeholder="Buscar em mensagens..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Logs</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Tempo Medio de Processamento</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.avgProcessingTime}ms</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Total de Deteccoes</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalDetections}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-slate-500">Erros/Avisos</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {stats.errors}/{stats.warnings}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Logs */}
      <div className="space-y-2">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <Card key={log.id} className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {getLogIcon(log.level)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">{log.message}</p>
                          <Badge variant="outline" className="text-xs">
                            {log.module}
                          </Badge>
                          <Badge className={`text-xs font-medium ${getLogBadgeVariant(log.level)}`}>
                            {log.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          <span className="font-medium">{log.cameraName}</span>
                          {' • '}
                          {new Date(log.timestamp).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </p>
                        <div className="mt-2 flex gap-4 text-xs text-slate-600">
                          {log.processingTime && (
                            <span>
                              <span className="font-medium">Tempo:</span> {log.processingTime}ms
                            </span>
                          )}
                          {log.detections !== undefined && (
                            <span>
                              <span className="font-medium">Deteccoes:</span> {log.detections}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="py-8 text-center">
              <Info className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm text-slate-500">Nenhum log encontrado com os filtros selecionados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
