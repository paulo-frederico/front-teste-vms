/**
 * Página de Chamados do Técnico
 * Lista e gerenciamento de tickets de suporte
 */

import { useState } from 'react'
import {
  Ticket,
  Search,
  Calendar,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  ChevronRight,
  Phone,
  Mail,
  User,
  MessageSquare,
  Camera,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Mock data
const mockTickets = [
  {
    id: 'TKT-001',
    titulo: 'Câmera offline - Entrada Principal',
    descricao: 'A câmera da entrada principal parou de transmitir desde ontem às 15h. Verificar conexão de rede e alimentação.',
    cliente: 'Hospital Vida Plena',
    clienteContato: {
      nome: 'Dr. Carlos Silva',
      telefone: '(47) 99999-1234',
      email: 'carlos.silva@vidaplena.org',
    },
    local: 'Entrada Principal',
    endereco: 'Rua das Flores, 123 - Centro',
    prioridade: 'alta',
    status: 'em_andamento',
    cameras: ['CAM-001', 'CAM-002'],
    criadoEm: '2024-01-14T08:30:00',
    atualizadoEm: '2024-01-14T10:00:00',
    historico: [
      { data: '2024-01-14T08:30:00', acao: 'Chamado criado', autor: 'Sistema' },
      { data: '2024-01-14T09:00:00', acao: 'Atribuído ao técnico', autor: 'Admin Master' },
      { data: '2024-01-14T10:00:00', acao: 'Status alterado para Em Andamento', autor: 'Técnico João' },
    ],
  },
  {
    id: 'TKT-002',
    titulo: 'Ajuste de foco - Estacionamento',
    descricao: 'Câmera do estacionamento A está com foco desregulado após ventania. Imagem está borrada.',
    cliente: 'Retail Park Brasil',
    clienteContato: {
      nome: 'Maria Santos',
      telefone: '(47) 98888-5678',
      email: 'maria.santos@retailpark.com',
    },
    local: 'Estacionamento A',
    endereco: 'Av. Brasil, 5000 - Distrito Industrial',
    prioridade: 'media',
    status: 'pendente',
    cameras: ['CAM-015'],
    criadoEm: '2024-01-14T10:15:00',
    atualizadoEm: '2024-01-14T10:15:00',
    historico: [
      { data: '2024-01-14T10:15:00', acao: 'Chamado criado', autor: 'Cliente' },
    ],
  },
  {
    id: 'TKT-003',
    titulo: 'Instalação de nova câmera',
    descricao: 'Instalar nova câmera PTZ na quadra esportiva conforme projeto aprovado.',
    cliente: 'Colégio Horizonte',
    clienteContato: {
      nome: 'Pedro Oliveira',
      telefone: '(47) 97777-9012',
      email: 'pedro@horizonte.edu',
    },
    local: 'Quadra Esportiva',
    endereco: 'Rua da Educação, 500 - Jardim Europa',
    prioridade: 'baixa',
    status: 'pendente',
    cameras: [],
    criadoEm: '2024-01-13T14:00:00',
    atualizadoEm: '2024-01-13T14:00:00',
    historico: [
      { data: '2024-01-13T14:00:00', acao: 'Chamado criado', autor: 'Admin' },
    ],
  },
  {
    id: 'TKT-004',
    titulo: 'Manutenção preventiva',
    descricao: 'Realizar limpeza e verificação de todas as câmeras do setor administrativo.',
    cliente: 'Inova Agro Logística',
    clienteContato: {
      nome: 'Ana Costa',
      telefone: '(47) 96666-3456',
      email: 'ana.costa@inovaagro.com',
    },
    local: 'Setor Administrativo',
    endereco: 'Rod. BR-101, Km 45 - Zona Rural',
    prioridade: 'baixa',
    status: 'concluido',
    cameras: ['CAM-020', 'CAM-021', 'CAM-022', 'CAM-023'],
    criadoEm: '2024-01-12T09:00:00',
    atualizadoEm: '2024-01-13T16:30:00',
    historico: [
      { data: '2024-01-12T09:00:00', acao: 'Chamado criado', autor: 'Sistema' },
      { data: '2024-01-12T10:00:00', acao: 'Atribuído ao técnico', autor: 'Admin' },
      { data: '2024-01-13T14:00:00', acao: 'Iniciado atendimento', autor: 'Técnico João' },
      { data: '2024-01-13T16:30:00', acao: 'Chamado concluído', autor: 'Técnico João' },
    ],
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

export function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('todas')
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null)
  const [comentario, setComentario] = useState('')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || ticket.status === statusFilter
    const matchesPrioridade = prioridadeFilter === 'todas' || ticket.prioridade === prioridadeFilter
    return matchesSearch && matchesStatus && matchesPrioridade
  })

  const ticketsPendentes = filteredTickets.filter(t => t.status === 'pendente')
  const ticketsEmAndamento = filteredTickets.filter(t => t.status === 'em_andamento')
  const ticketsConcluidos = filteredTickets.filter(t => t.status === 'concluido')

  const handleIniciarAtendimento = (ticketId: string) => {
    console.log('Iniciar atendimento:', ticketId)
    // TODO: Implementar lógica de iniciar atendimento
  }

  const handleConcluirAtendimento = (ticketId: string) => {
    console.log('Concluir atendimento:', ticketId)
    // TODO: Implementar lógica de concluir atendimento
  }

  const handleAdicionarComentario = () => {
    if (!comentario.trim()) return
    console.log('Adicionar comentário:', comentario)
    setComentario('')
    // TODO: Implementar lógica de adicionar comentário
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">Meus Chamados</h1>
          <p className="text-muted-foreground">Gerencie seus chamados de suporte técnico</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Ticket className="h-3 w-3" />
            {filteredTickets.length} chamados
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, cliente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por Status */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">
            Todos ({filteredTickets.length})
          </TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes ({ticketsPendentes.length})
          </TabsTrigger>
          <TabsTrigger value="em_andamento">
            Em Andamento ({ticketsEmAndamento.length})
          </TabsTrigger>
          <TabsTrigger value="concluidos">
            Concluídos ({ticketsConcluidos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <TicketList tickets={filteredTickets} onSelect={setSelectedTicket} />
        </TabsContent>
        <TabsContent value="pendentes" className="mt-4">
          <TicketList tickets={ticketsPendentes} onSelect={setSelectedTicket} />
        </TabsContent>
        <TabsContent value="em_andamento" className="mt-4">
          <TicketList tickets={ticketsEmAndamento} onSelect={setSelectedTicket} />
        </TabsContent>
        <TabsContent value="concluidos" className="mt-4">
          <TicketList tickets={ticketsConcluidos} onSelect={setSelectedTicket} />
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-sm">
                        {selectedTicket.id}
                      </span>
                    </DialogTitle>
                    <DialogDescription className="text-base font-medium text-foreground mt-1">
                      {selectedTicket.titulo}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={cn(prioridadeColors[selectedTicket.prioridade as keyof typeof prioridadeColors])}>
                      {selectedTicket.prioridade.charAt(0).toUpperCase() + selectedTicket.prioridade.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={cn(statusColors[selectedTicket.status as keyof typeof statusColors])}>
                      {statusLabels[selectedTicket.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Descrição */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Descrição</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {selectedTicket.descricao}
                  </p>
                </div>

                {/* Informações do Cliente */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTicket.cliente}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTicket.local}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="ml-6 text-xs">{selectedTicket.endereco}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Contato</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTicket.clienteContato.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selectedTicket.clienteContato.telefone}`} className="text-primary hover:underline">
                          {selectedTicket.clienteContato.telefone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selectedTicket.clienteContato.email}`} className="text-primary hover:underline">
                          {selectedTicket.clienteContato.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Câmeras Relacionadas */}
                {selectedTicket.cameras.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Câmeras Relacionadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTicket.cameras.map((cam) => (
                        <Badge key={cam} variant="secondary" className="gap-1">
                          <Camera className="h-3 w-3" />
                          {cam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Histórico */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Histórico</h4>
                  <div className="space-y-2">
                    {selectedTicket.historico.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <div className="flex-1">
                          <p>{item.acao}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.autor} • {formatDate(item.data)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adicionar Comentário */}
                {selectedTicket.status !== 'concluido' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Adicionar Comentário</h4>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Digite um comentário ou atualização..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={handleAdicionarComentario} disabled={!comentario.trim()}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  {selectedTicket.status === 'pendente' && (
                    <Button onClick={() => handleIniciarAtendimento(selectedTicket.id)}>
                      <Clock className="h-4 w-4 mr-2" />
                      Iniciar Atendimento
                    </Button>
                  )}
                  {selectedTicket.status === 'em_andamento' && (
                    <Button onClick={() => handleConcluirAtendimento(selectedTicket.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Concluir Atendimento
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de lista de tickets
function TicketList({
  tickets,
  onSelect
}: {
  tickets: typeof mockTickets
  onSelect: (ticket: typeof mockTickets[0]) => void
}) {
  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Nenhum chamado encontrado</p>
            <p className="text-sm">Tente ajustar os filtros de busca</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="cursor-pointer transition-colors hover:bg-muted/50"
          onClick={() => onSelect(ticket)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={cn(
                'mt-1 h-3 w-3 rounded-full shrink-0',
                ticket.prioridade === 'alta' && 'bg-red-500',
                ticket.prioridade === 'media' && 'bg-yellow-500',
                ticket.prioridade === 'baixa' && 'bg-green-500'
              )} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                      <Badge variant="outline" className={cn('text-[10px]', statusColors[ticket.status as keyof typeof statusColors])}>
                        {statusLabels[ticket.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <p className="font-medium mt-1">{ticket.titulo}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {ticket.cliente}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {ticket.local}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(ticket.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
