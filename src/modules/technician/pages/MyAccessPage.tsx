/**
 * Página de Acessos Ativos do Técnico
 * Lista os acessos temporários concedidos pelos clientes
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  KeyRound,
  Clock,
  Building2,
  Camera,
  AlertTriangle,
  CheckCircle2,
  User,
  Calendar,
  Video,
  Shield,
  Info,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Mock data
const mockAcessos = [
  {
    id: '1',
    cliente: 'Hospital Vida Plena',
    tenantId: 'tenant-001',
    concedidoPor: {
      nome: 'Dr. Carlos Silva',
      cargo: 'Diretor de TI',
    },
    concedidoEm: '2024-01-14T08:00:00',
    expiraEm: '2024-01-14T18:00:00',
    motivo: 'Manutenção preventiva das câmeras do setor de emergência',
    cameras: [
      { id: 'CAM-001', nome: 'Entrada Principal', status: 'online' },
      { id: 'CAM-002', nome: 'Recepção', status: 'online' },
      { id: 'CAM-003', nome: 'Corredor UTI', status: 'offline' },
      { id: 'CAM-004', nome: 'Estacionamento', status: 'online' },
      { id: 'CAM-005', nome: 'Emergência', status: 'online' },
    ],
    sites: ['Prédio Principal', 'Anexo'],
    permissoes: ['visualizar', 'configurar', 'reiniciar'],
    status: 'ativo',
  },
  {
    id: '2',
    cliente: 'Retail Park Brasil',
    tenantId: 'tenant-002',
    concedidoPor: {
      nome: 'Maria Santos',
      cargo: 'Gerente de Segurança',
    },
    concedidoEm: '2024-01-14T10:00:00',
    expiraEm: '2024-01-15T12:00:00',
    motivo: 'Ajuste de foco e posicionamento das câmeras do estacionamento',
    cameras: [
      { id: 'CAM-015', nome: 'Estacionamento A', status: 'online' },
      { id: 'CAM-016', nome: 'Estacionamento B', status: 'online' },
      { id: 'CAM-017', nome: 'Entrada Loja', status: 'online' },
    ],
    sites: ['Shopping Center'],
    permissoes: ['visualizar', 'configurar'],
    status: 'ativo',
  },
  {
    id: '3',
    cliente: 'Colégio Horizonte',
    tenantId: 'tenant-003',
    concedidoPor: {
      nome: 'Pedro Oliveira',
      cargo: 'Coordenador',
    },
    concedidoEm: '2024-01-13T14:00:00',
    expiraEm: '2024-01-13T18:00:00',
    motivo: 'Instalação de nova câmera na quadra',
    cameras: [],
    sites: ['Campus Principal'],
    permissoes: ['visualizar'],
    status: 'expirado',
  },
]

const permissaoLabels: Record<string, string> = {
  visualizar: 'Visualizar',
  configurar: 'Configurar',
  reiniciar: 'Reiniciar',
  exportar: 'Exportar',
}

export function MyAccessPage() {
  const [expandedAccess, setExpandedAccess] = useState<string | null>(null)

  const acessosAtivos = mockAcessos.filter(a => a.status === 'ativo')
  const acessosExpirados = mockAcessos.filter(a => a.status === 'expirado')

  const getTimeRemaining = (expiraEm: string) => {
    const now = new Date()
    const expiry = new Date(expiraEm)
    const diff = expiry.getTime() - now.getTime()

    if (diff < 0) return { text: 'Expirado', percentage: 0, isExpired: true }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    // Calcular porcentagem baseado em 24h
    const totalDuration = new Date(expiraEm).getTime() - new Date(mockAcessos.find(a => a.expiraEm === expiraEm)?.concedidoEm || expiraEm).getTime()
    const percentage = Math.max(0, Math.min(100, (diff / totalDuration) * 100))

    if (hours === 0) {
      return { text: `${minutes}min restantes`, percentage, isExpired: false, isUrgent: true }
    }
    return { text: `${hours}h ${minutes}min restantes`, percentage, isExpired: false, isUrgent: hours < 2 }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">Acessos Ativos</h1>
          <p className="text-muted-foreground">Clientes que concederam acesso temporário às suas câmeras</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="gap-1">
            <KeyRound className="h-3 w-3" />
            {acessosAtivos.length} acessos ativos
          </Badge>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Sobre os acessos temporários</p>
              <p className="text-blue-700">
                Os clientes podem conceder acesso temporário às suas câmeras para que você possa realizar
                manutenções e diagnósticos. Cada acesso tem um prazo de validade e permissões específicas.
                Respeite sempre o escopo autorizado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acessos Ativos */}
      {acessosAtivos.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Acessos Ativos
          </h2>
          {acessosAtivos.map((acesso) => {
            const timeInfo = getTimeRemaining(acesso.expiraEm)
            const isExpanded = expandedAccess === acesso.id

            return (
              <Card key={acesso.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{acesso.cliente}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <User className="h-3 w-3" />
                          Concedido por: {acesso.concedidoPor.nome} ({acesso.concedidoPor.cargo})
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="gap-1 mb-2">
                        <Camera className="h-3 w-3" />
                        {acesso.cameras.length} câmeras
                      </Badge>
                      <div className={cn(
                        'flex items-center gap-1.5 text-sm',
                        timeInfo.isUrgent ? 'text-orange-600' : 'text-muted-foreground'
                      )}>
                        {timeInfo.isUrgent && <AlertTriangle className="h-4 w-4" />}
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{timeInfo.text}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <Progress value={timeInfo.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Início: {formatDate(acesso.concedidoEm)}</span>
                      <span>Expira: {formatDate(acesso.expiraEm)}</span>
                    </div>
                  </div>

                  {/* Motivo */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Motivo:</span> {acesso.motivo}
                    </p>
                  </div>

                  {/* Permissões */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">Permissões:</span>
                    {acesso.permissoes.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {permissaoLabels[perm] || perm}
                      </Badge>
                    ))}
                  </div>

                  {/* Lista de Câmeras (expandível) */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setExpandedAccess(isExpanded ? null : acesso.id)}
                    >
                      <span className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Ver câmeras autorizadas
                      </span>
                      <span className={cn('transition-transform', isExpanded && 'rotate-180')}>
                        ▼
                      </span>
                    </Button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                        {acesso.cameras.map((camera) => (
                          <div key={camera.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'h-2 w-2 rounded-full',
                                camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                              )} />
                              <span>{camera.nome}</span>
                              <span className="text-xs text-muted-foreground">({camera.id})</span>
                            </div>
                            <Badge variant="outline" className={cn(
                              'text-[10px]',
                              camera.status === 'online' ? 'text-green-700' : 'text-red-700'
                            )}>
                              {camera.status === 'online' ? 'Online' : 'Offline'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/technician/diagnostics">
                        Diagnóstico
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/technician/live">
                        <Video className="h-4 w-4 mr-2" />
                        Acessar Câmeras
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <KeyRound className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum acesso ativo no momento</p>
              <p className="text-sm mt-1">
                Os clientes podem conceder acesso temporário quando necessário
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acessos Expirados */}
      {acessosExpirados.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            Acessos Expirados (Recentes)
          </h2>
          {acessosExpirados.map((acesso) => (
            <Card key={acesso.id} className="opacity-60">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{acesso.cliente}</p>
                      <p className="text-xs text-muted-foreground">
                        Expirou em: {formatDate(acesso.expiraEm)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    Expirado
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
