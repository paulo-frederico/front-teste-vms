import { useState, useMemo } from 'react'
import { AlertCircle, Info, AlertTriangle, Bug } from 'lucide-react'
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
import type { CameraLog, CameraLogLevel } from '../mockDiagnostics'
import { MOCK_CAMERA_LOGS } from '../mockDiagnostics'

type CameraLogViewerProps = {
  logs?: CameraLog[]
}

export function CameraLogViewer({ logs = MOCK_CAMERA_LOGS }: CameraLogViewerProps) {
  const [levelFilter, setLevelFilter] = useState<CameraLogLevel | 'ALL'>('ALL')
  const [cameraFilter, setCameraFilter] = useState('ALL')
  const [searchText, setSearchText] = useState('')

  const cameras = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.cameraName))).sort()
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter
      const matchesCamera = cameraFilter === 'ALL' || log.cameraName === cameraFilter
      const matchesSearch =
        searchText === '' ||
        log.message.toLowerCase().includes(searchText.toLowerCase()) ||
        log.cameraName.toLowerCase().includes(searchText.toLowerCase())

      return matchesLevel && matchesCamera && matchesSearch
    })
  }, [logs, levelFilter, cameraFilter, searchText])

  const getLogIcon = (level: CameraLogLevel) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'debug':
        return <Bug className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getLogBadgeVariant = (level: CameraLogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-orange-100 text-orange-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      case 'debug':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
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
                  <SelectItem value="debug">Debug</SelectItem>
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
                        {log.details && (
                          <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                            {log.details}
                          </p>
                        )}
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

      {/* Resumo */}
      <div className="grid gap-2 md:grid-cols-4 text-xs text-slate-600">
        <div>
          <span className="font-medium">Total:</span> {filteredLogs.length} log(s)
        </div>
        <div>
          <span className="font-medium">Erros:</span> {filteredLogs.filter((l) => l.level === 'error').length}
        </div>
        <div>
          <span className="font-medium">Avisos:</span> {filteredLogs.filter((l) => l.level === 'warning').length}
        </div>
        <div>
          <span className="font-medium">Info:</span> {filteredLogs.filter((l) => l.level === 'info').length}
        </div>
      </div>
    </div>
  )
}
