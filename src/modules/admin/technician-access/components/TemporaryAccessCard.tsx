import { Clock, User, CheckCircle, AlertCircle, X, Edit2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type TemporaryTechnicianAccess } from '../mockTemporaryAccess'

type TemporaryAccessCardProps = {
  access: TemporaryTechnicianAccess
  onEdit?: (access: TemporaryTechnicianAccess) => void
  onRevoke?: (access: TemporaryTechnicianAccess) => void
}

export function TemporaryAccessCard({
  access,
  onEdit,
  onRevoke
}: TemporaryAccessCardProps) {
  const now = new Date()
  const startDate = new Date(access.startTime)
  const endDate = new Date(access.endTime)
  const isActive = access.status === 'active' && endDate > now
  const timeRemaining = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / 1000))
  const minutesRemaining = Math.floor(timeRemaining / 60)
  const hoursRemaining = Math.floor(minutesRemaining / 60)

  const accessLevelLabels = {
    'view-only': '👁️ Apenas Visualização',
    'view-livestream': '📹 Visualização ao Vivo',
    'full-control': '⚙️ Controle Total'
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    expired: 'bg-slate-100 text-slate-600 border-slate-200',
    revoked: 'bg-red-100 text-red-700 border-red-200'
  }

  const getTimeRemainingDisplay = () => {
    if (access.status === 'revoked') {
      return `Revogado em ${new Date(access.revokedAt!).toLocaleTimeString('pt-BR')}`
    }
    if (access.status === 'expired') {
      return `Expirado em ${endDate.toLocaleTimeString('pt-BR')}`
    }
    if (hoursRemaining > 0) {
      return `${hoursRemaining}h ${minutesRemaining % 60}m restante`
    }
    return `${minutesRemaining}m restante`
  }

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100 hover:ring-slate-200 transition-all">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">{access.technicianName}</h3>
              <Badge
                variant="outline"
                className={`text-xs ${statusColors[access.status]}`}
              >
                {access.status === 'active' ? 'Ativo' : 
                 access.status === 'expired' ? 'Expirado' : 'Revogado'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{access.technicianEmail}</p>
          </div>

          {isActive && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(access)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onRevoke && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRevoke(access)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Motivo */}
        <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
          <p className="text-xs font-medium text-slate-500 mb-1">MOTIVO</p>
          <p className="text-sm text-slate-900 font-medium">{access.reason}</p>
          {access.notes && (
            <p className="text-xs text-slate-600 mt-2 italic">{access.notes}</p>
          )}
        </div>

        {/* Configuração de Acesso */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">TIPO</p>
            <p className="text-sm font-medium text-slate-900">
              {access.accessType === 'full'
                ? '📷 Todas câmeras'
                : `📷 ${access.cameraIds.length} câmera(s)`}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">NÍVEL</p>
            <p className="text-sm font-medium text-slate-900">
              {accessLevelLabels[access.accessLevel]}
            </p>
          </div>
        </div>

        {/* Duração e Tempo Restante */}
        <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-900">
                <strong>Tempo Restante:</strong>
              </span>
            </div>
            <span className={`text-sm font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
              {getTimeRemainingDisplay()}
            </span>
          </div>
          <div className="text-xs text-blue-700">
            <p>Início: {startDate.toLocaleString('pt-BR')}</p>
            <p>Término: {endDate.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {isActive && (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-green-700">Acesso ativo</span>
              </>
            )}
            {!isActive && (
              <>
                <AlertCircle className="h-3 w-3 text-amber-600" />
                <span className="text-slate-500">Acesso inativo</span>
              </>
            )}
          </div>
          <time>
            Criado em {new Date(access.createdAt).toLocaleDateString('pt-BR')}
          </time>
        </div>
      </CardContent>
    </Card>
  )
}
