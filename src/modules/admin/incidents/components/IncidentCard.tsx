import { AlertTriangle, User, MessageSquare, CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type Incident } from '../mockIncidents'

type IncidentCardProps = {
  incident: Incident
  onEdit?: (incident: Incident) => void
  onDelete?: (incident: Incident) => void
}

export function IncidentCard({ incident, onEdit, onDelete }: IncidentCardProps) {
  const priorityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  }

  const statusColors: Record<string, string> = {
    open: 'bg-red-100 text-red-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'waiting-customer': 'bg-purple-100 text-purple-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-700'
  }

  const statusLabels: Record<string, string> = {
    open: '🔴 Aberto',
    'in-progress': '🟡 Em Progresso',
    'waiting-customer': '⏸️ Aguardando',
    resolved: '✅ Resolvido',
    closed: '🔒 Fechado'
  }

  const typeLabels: Record<string, string> = {
    'camera-offline': '📷 Câmera Offline',
    'ai-error': '🤖 Erro de IA',
    'performance': '⚡ Performance',
    'security': '🔒 Segurança',
    'maintenance': '🔧 Manutenção',
    'other': '❓ Outro'
  }

  const timeElapsed = Math.floor(
    (new Date().getTime() - new Date(incident.createdAt).getTime()) / 1000
  )
  const hoursElapsed = Math.floor(timeElapsed / 3600)
  const daysElapsed = Math.floor(hoursElapsed / 24)

  const getTimeDisplay = () => {
    if (daysElapsed > 0) {
      return `${daysElapsed}d atrás`
    }
    return `${hoursElapsed}h atrás`
  }

  return (
    <Card className={`border-0 shadow-sm ring-1 transition-all ${
      incident.priority === 'critical'
        ? 'bg-red-50 ring-red-200 hover:ring-red-300'
        : incident.priority === 'high'
          ? 'bg-orange-50 ring-orange-200 hover:ring-orange-300'
          : 'bg-white ring-slate-100 hover:ring-slate-200'
    }`}>
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">{incident.title}</h3>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">
              {incident.description}
            </p>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(incident)}
                className="text-slate-500 hover:text-slate-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(incident)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`text-xs ${priorityColors[incident.priority]}`}
          >
            {incident.priority === 'critical'
              ? '🔴 Crítica'
              : incident.priority === 'high'
                ? '🟠 Alta'
                : incident.priority === 'medium'
                  ? '🟡 Média'
                  : '🟢 Baixa'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {typeLabels[incident.type]}
          </Badge>
          <Badge
            className={`text-xs ${statusColors[incident.status]}`}
          >
            {statusLabels[incident.status]}
          </Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {incident.cameraName && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">CÂMERA</p>
              <p className="text-slate-900 font-medium">{incident.cameraName}</p>
            </div>
          )}
          {incident.assignedTechnicianName && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">ATRIBUÍDO A</p>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <p className="text-slate-900 font-medium">
                  {incident.assignedTechnicianName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-slate-500 space-x-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{getTimeDisplay()}</span>
          </div>
          {incident.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{incident.comments.length} comentário{incident.comments.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          {incident.status === 'resolved' || incident.status === 'closed' ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" />
              <span>Resolvido em {new Date(incident.resolvedAt!).toLocaleDateString('pt-BR')}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
