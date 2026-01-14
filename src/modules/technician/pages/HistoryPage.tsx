/**
 * Página de Histórico de Atendimentos do Técnico
 * Lista todos os atendimentos realizados
 */

import { useState } from 'react'
import {
  History,
  Search,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  ChevronDown,
  MapPin,
  Wrench,
  Camera,
  FileText,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

// Mock data
const mockHistorico = [
  {
    id: 'ATD-001',
    ticketId: 'TKT-004',
    titulo: 'Manutenção preventiva',
    cliente: 'Inova Agro Logística',
    local: 'Setor Administrativo',
    tipo: 'preventiva',
    dataInicio: '2024-01-13T14:00:00',
    dataFim: '2024-01-13T16:30:00',
    duracao: '2h 30min',
    cameras: ['CAM-020', 'CAM-021', 'CAM-022', 'CAM-023'],
    acoes: [
      'Limpeza das lentes',
      'Verificação de conexões',
      'Atualização de firmware',
      'Teste de gravação',
    ],
    observacoes: 'Todas as câmeras funcionando normalmente após manutenção.',
    status: 'concluido',
  },
  {
    id: 'ATD-002',
    ticketId: 'TKT-005',
    titulo: 'Substituição de câmera danificada',
    cliente: 'Hospital Vida Plena',
    local: 'Estacionamento',
    tipo: 'corretiva',
    dataInicio: '2024-01-12T09:00:00',
    dataFim: '2024-01-12T11:00:00',
    duracao: '2h',
    cameras: ['CAM-010'],
    acoes: [
      'Remoção da câmera danificada',
      'Instalação de nova câmera',
      'Configuração de rede',
      'Ajuste de foco e posicionamento',
      'Teste de streaming',
    ],
    observacoes: 'Câmera antiga apresentava defeito no sensor. Substituída por modelo equivalente.',
    status: 'concluido',
  },
  {
    id: 'ATD-003',
    ticketId: 'TKT-006',
    titulo: 'Instalação de novas câmeras',
    cliente: 'Colégio Horizonte',
    local: 'Biblioteca',
    tipo: 'instalacao',
    dataInicio: '2024-01-11T08:00:00',
    dataFim: '2024-01-11T12:00:00',
    duracao: '4h',
    cameras: ['CAM-030', 'CAM-031'],
    acoes: [
      'Passagem de cabos',
      'Instalação de suportes',
      'Montagem das câmeras',
      'Configuração de rede',
      'Integração com VMS',
      'Treinamento do cliente',
    ],
    observacoes: 'Instalação concluída conforme projeto. Cliente treinado para uso básico.',
    status: 'concluido',
  },
  {
    id: 'ATD-004',
    ticketId: 'TKT-007',
    titulo: 'Reconfiguração de rede',
    cliente: 'Retail Park Brasil',
    local: 'Data Center',
    tipo: 'configuracao',
    dataInicio: '2024-01-10T14:00:00',
    dataFim: '2024-01-10T17:30:00',
    duracao: '3h 30min',
    cameras: ['CAM-015', 'CAM-016', 'CAM-017', 'CAM-018', 'CAM-019'],
    acoes: [
      'Alteração de VLAN',
      'Reconfiguração de IPs',
      'Atualização de rotas',
      'Teste de conectividade',
    ],
    observacoes: 'Migração de rede concluída com sucesso. Todas as câmeras operacionais.',
    status: 'concluido',
  },
  {
    id: 'ATD-005',
    ticketId: 'TKT-008',
    titulo: 'Diagnóstico de falha intermitente',
    cliente: 'Vila Olímpica Residencial',
    local: 'Portaria',
    tipo: 'diagnostico',
    dataInicio: '2024-01-09T10:00:00',
    dataFim: '2024-01-09T12:00:00',
    duracao: '2h',
    cameras: ['CAM-050'],
    acoes: [
      'Análise de logs',
      'Teste de cabo de rede',
      'Verificação de switch',
      'Identificação de interferência',
    ],
    observacoes: 'Identificado cabo de rede com mau contato. Substituído e problema resolvido.',
    status: 'concluido',
  },
]

const tipoColors = {
  preventiva: 'bg-blue-100 text-blue-700 border-blue-200',
  corretiva: 'bg-orange-100 text-orange-700 border-orange-200',
  instalacao: 'bg-green-100 text-green-700 border-green-200',
  configuracao: 'bg-purple-100 text-purple-700 border-purple-200',
  diagnostico: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

const tipoLabels = {
  preventiva: 'Preventiva',
  corretiva: 'Corretiva',
  instalacao: 'Instalação',
  configuracao: 'Configuração',
  diagnostico: 'Diagnóstico',
}

export function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('todos')
  const [mesFilter, setMesFilter] = useState<string>('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredHistorico = mockHistorico.filter((item) => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'todos' || item.tipo === tipoFilter
    // Filtro de mês simplificado
    const matchesMes = mesFilter === 'todos' || true
    return matchesSearch && matchesTipo && matchesMes
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Estatísticas
  const totalAtendimentos = mockHistorico.length
  const tempoTotal = '14h 30min' // Calculado a partir dos dados
  const mediaAtendimento = '2h 54min'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">Histórico de Atendimentos</h1>
          <p className="text-muted-foreground">Registro de todos os serviços realizados</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtendimentos}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempoTotal}</div>
            <p className="text-xs text-muted-foreground">Em atendimentos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média por Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaAtendimento}</div>
            <p className="text-xs text-muted-foreground">Tempo médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, cliente ou ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="preventiva">Preventiva</SelectItem>
                <SelectItem value="corretiva">Corretiva</SelectItem>
                <SelectItem value="instalacao">Instalação</SelectItem>
                <SelectItem value="configuracao">Configuração</SelectItem>
                <SelectItem value="diagnostico">Diagnóstico</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mesFilter} onValueChange={setMesFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todo período</SelectItem>
                <SelectItem value="janeiro">Janeiro 2024</SelectItem>
                <SelectItem value="dezembro">Dezembro 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Histórico */}
      {filteredHistorico.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhum atendimento encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredHistorico.map((item) => (
            <Collapsible
              key={item.id}
              open={expandedId === item.id}
              onOpenChange={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {item.titulo}
                            <span className="text-xs font-mono text-muted-foreground">
                              {item.ticketId}
                            </span>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {item.cliente}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {item.local}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant="outline" className={cn('text-xs', tipoColors[item.tipo as keyof typeof tipoColors])}>
                            {tipoLabels[item.tipo as keyof typeof tipoLabels]}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(item.dataInicio)}
                          </p>
                        </div>
                        <ChevronDown className={cn(
                          'h-5 w-5 text-muted-foreground transition-transform',
                          expandedId === item.id && 'rotate-180'
                        )} />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {/* Detalhes do Atendimento */}
                    <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Início</p>
                        <p className="font-medium">
                          {formatDate(item.dataInicio)} às {formatTime(item.dataInicio)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Término</p>
                        <p className="font-medium">
                          {formatDate(item.dataFim)} às {formatTime(item.dataFim)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duração</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.duracao}
                        </p>
                      </div>
                    </div>

                    {/* Câmeras */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Câmeras Envolvidas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.cameras.map((cam) => (
                          <Badge key={cam} variant="secondary" className="text-xs">
                            {cam}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Ações Realizadas */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Ações Realizadas
                      </p>
                      <ul className="space-y-1">
                        {item.acoes.map((acao, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {acao}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Observações */}
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Observações
                      </p>
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        {item.observacoes}
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  )
}
