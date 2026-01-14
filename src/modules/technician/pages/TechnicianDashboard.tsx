/**
 * Dashboard do Técnico
 * Visão geral dos chamados, acessos ativos e métricas
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Ticket,
  KeyRound,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ArrowRight,
  Calendar,
  MapPin,
  Building2,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Mock data para demonstração
const mockStats = {
  ticketsAbertos: 3,
  ticketsHoje: 2,
  acessosAtivos: 4,
  camerasAutorizadas: 12,
  atendimentosMes: 28,
  tempoMedioAtendimento: '45min',
}

const mockTickets = [
  {
    id: 'TKT-001',
    titulo: 'Câmera offline - Entrada Principal',
    cliente: 'Hospital Vida Plena',
    local: 'Entrada Principal',
    prioridade: 'alta',
    status: 'em_andamento',
    criadoEm: '2024-01-14T08:30:00',
  },
  {
    id: 'TKT-002',
    titulo: 'Ajuste de foco - Estacionamento',
    cliente: 'Retail Park Brasil',
    local: 'Estacionamento A',
    prioridade: 'media',
    status: 'pendente',
    criadoEm: '2024-01-14T10:15:00',
  },
  {
    id: 'TKT-003',
    titulo: 'Instalação de nova câmera',
    cliente: 'Colégio Horizonte',
    local: 'Quadra Esportiva',
    prioridade: 'baixa',
    status: 'pendente',
    criadoEm: '2024-01-13T14:00:00',
  },
]

const mockAcessosAtivos = [
  {
    id: '1',
    cliente: 'Hospital Vida Plena',
    concedidoPor: 'Dr. Carlos Silva',
    expiraEm: '2024-01-14T18:00:00',
    cameras: 5,
  },
  {
    id: '2',
    cliente: 'Retail Park Brasil',
    concedidoPor: 'Maria Santos',
    expiraEm: '2024-01-15T12:00:00',
    cameras: 3,
  },
]

const prioridadeColors = {
  alta: 'bg-red-100 text-red-700 border-red-200',
  media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  baixa: 'bg-green-100 text-green-700 border-green-200',
}

const statusColors = {
  pendente: 'bg-gray-100 text-gray-700',
  em_andamento: 'bg-blue-100 text-blue-700',
  concluido: 'bg-green-100 text-green-700',
}

const statusLabels = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
}

export function TechnicianDashboard() {
  const [, setSelectedTicket] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeRemaining = (expiraEm: string) => {
    const now = new Date()
    const expiry = new Date(expiraEm)
    const diff = expiry.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours < 0) return 'Expirado'
    if (hours === 0) return `${minutes}min restantes`
    return `${hours}h ${minutes}min restantes`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-deep">Dashboard do Técnico</h1>
        <p className="text-muted-foreground">Bem-vindo! Aqui está o resumo das suas atividades.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chamados Abertos
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.ticketsAbertos}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.ticketsHoje} novos hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Acessos Ativos
            </CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.acessosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.camerasAutorizadas} câmeras autorizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atendimentos (Mês)
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.atendimentosMes}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.tempoMedioAtendimento}</div>
            <p className="text-xs text-muted-foreground">
              Por atendimento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chamados Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chamados Recentes</CardTitle>
              <CardDescription>Seus chamados pendentes e em andamento</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/technician/tickets">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div className={cn(
                    'mt-0.5 h-2 w-2 rounded-full shrink-0',
                    ticket.prioridade === 'alta' && 'bg-red-500',
                    ticket.prioridade === 'media' && 'bg-yellow-500',
                    ticket.prioridade === 'baixa' && 'bg-green-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{ticket.titulo}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span>{ticket.cliente}</span>
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          <span>{ticket.local}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn('shrink-0 text-[10px]', statusColors[ticket.status as keyof typeof statusColors])}>
                        {statusLabels[ticket.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={cn('text-[10px]', prioridadeColors[ticket.prioridade as keyof typeof prioridadeColors])}>
                        {ticket.prioridade.charAt(0).toUpperCase() + ticket.prioridade.slice(1)}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(ticket.criadoEm)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acessos Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Acessos Ativos</CardTitle>
              <CardDescription>Clientes que concederam acesso temporário</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/technician/access">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAcessosAtivos.map((acesso) => {
                const timeRemaining = getTimeRemaining(acesso.expiraEm)
                const isExpiringSoon = timeRemaining.includes('min') && !timeRemaining.includes('h')

                return (
                  <div
                    key={acesso.id}
                    className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          <p className="font-medium">{acesso.cliente}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Concedido por: {acesso.concedidoPor}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        {acesso.cameras} câmeras
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className={cn(
                        'flex items-center gap-1.5 text-xs',
                        isExpiringSoon ? 'text-orange-600' : 'text-muted-foreground'
                      )}>
                        {isExpiringSoon && <AlertTriangle className="h-3 w-3" />}
                        <Clock className="h-3 w-3" />
                        <span>{timeRemaining}</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                        <Link to="/technician/live">
                          Acessar câmeras
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}

              {mockAcessosAtivos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <KeyRound className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum acesso ativo no momento</p>
                  <p className="text-xs">Os clientes podem conceder acesso temporário</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às ferramentas mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/technician/tickets">
                <Ticket className="h-5 w-5" />
                <span>Meus Chamados</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/technician/diagnostics">
                <AlertTriangle className="h-5 w-5" />
                <span>Diagnóstico</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/technician/cameras">
                <Camera className="h-5 w-5" />
                <span>Câmeras Autorizadas</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/technician/history">
                <CheckCircle2 className="h-5 w-5" />
                <span>Histórico</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
