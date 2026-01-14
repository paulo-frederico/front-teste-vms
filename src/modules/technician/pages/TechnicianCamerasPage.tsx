/**
 * Página de Câmeras Autorizadas do Técnico
 * Lista todas as câmeras que o técnico tem acesso
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Search,
  Building2,
  MapPin,
  Signal,
  Video,
  Wrench,
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
import { cn } from '@/lib/utils'

// Mock data
const mockCameras = [
  {
    id: 'CAM-001',
    nome: 'Entrada Principal',
    cliente: 'Hospital Vida Plena',
    local: 'Prédio Principal',
    modelo: 'Hikvision DS-2CD2143G2-I',
    ip: '192.168.1.101',
    status: 'online',
    qualidade: '1080p',
    fps: 30,
    ultimaConexao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-002',
    nome: 'Recepção',
    cliente: 'Hospital Vida Plena',
    local: 'Prédio Principal',
    modelo: 'Hikvision DS-2CD2143G2-I',
    ip: '192.168.1.102',
    status: 'online',
    qualidade: '1080p',
    fps: 30,
    ultimaConexao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-003',
    nome: 'Corredor UTI',
    cliente: 'Hospital Vida Plena',
    local: 'UTI Adulto',
    modelo: 'Dahua IPC-HDW2431T-AS',
    ip: '192.168.1.103',
    status: 'offline',
    qualidade: '1080p',
    fps: 25,
    ultimaConexao: '2024-01-14T08:00:00',
  },
  {
    id: 'CAM-004',
    nome: 'Estacionamento',
    cliente: 'Hospital Vida Plena',
    local: 'Área Externa',
    modelo: 'Intelbras VIP 5280 B',
    ip: '192.168.1.104',
    status: 'online',
    qualidade: '4K',
    fps: 15,
    ultimaConexao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-005',
    nome: 'Emergência',
    cliente: 'Hospital Vida Plena',
    local: 'Pronto Socorro',
    modelo: 'Hikvision DS-2CD2143G2-I',
    ip: '192.168.1.105',
    status: 'online',
    qualidade: '1080p',
    fps: 30,
    ultimaConexao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-015',
    nome: 'Estacionamento A',
    cliente: 'Retail Park Brasil',
    local: 'Shopping Center',
    modelo: 'Intelbras VIP 3230 B',
    ip: '192.168.2.15',
    status: 'online',
    qualidade: '1080p',
    fps: 25,
    ultimaConexao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-016',
    nome: 'Estacionamento B',
    cliente: 'Retail Park Brasil',
    local: 'Shopping Center',
    modelo: 'Intelbras VIP 3230 B',
    ip: '192.168.2.16',
    status: 'online',
    qualidade: '1080p',
    fps: 25,
    ultimaConexao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-017',
    nome: 'Entrada Loja',
    cliente: 'Retail Park Brasil',
    local: 'Shopping Center',
    modelo: 'Hikvision DS-2CD2143G2-I',
    ip: '192.168.2.17',
    status: 'warning',
    qualidade: '1080p',
    fps: 30,
    ultimaConexao: '2024-01-14T10:25:00',
  },
]

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  warning: 'bg-yellow-500',
}

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  warning: 'Instável',
}

export function TechnicianCamerasPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clienteFilter, setClienteFilter] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  // Extrair clientes únicos
  const clientes = [...new Set(mockCameras.map(c => c.cliente))]

  const filteredCameras = mockCameras.filter((camera) => {
    const matchesSearch = camera.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.ip.includes(searchTerm)
    const matchesCliente = clienteFilter === 'todos' || camera.cliente === clienteFilter
    const matchesStatus = statusFilter === 'todos' || camera.status === statusFilter
    return matchesSearch && matchesCliente && matchesStatus
  })

  const camerasOnline = mockCameras.filter(c => c.status === 'online').length
  const camerasOffline = mockCameras.filter(c => c.status === 'offline').length
  const camerasWarning = mockCameras.filter(c => c.status === 'warning').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">Câmeras Autorizadas</h1>
          <p className="text-muted-foreground">Todas as câmeras que você tem acesso para manutenção</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {camerasOnline} online
          </Badge>
          <Badge variant="outline" className="gap-1 text-yellow-700">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            {camerasWarning} instável
          </Badge>
          <Badge variant="outline" className="gap-1 text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {camerasOffline} offline
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
                placeholder="Buscar por nome, ID ou IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={clienteFilter} onValueChange={setClienteFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os clientes</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente} value={cliente}>{cliente}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="warning">Instável</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Câmeras */}
      {filteredCameras.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma câmera encontrada</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCameras.map((camera) => (
            <Card key={camera.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'h-3 w-3 rounded-full',
                      statusColors[camera.status as keyof typeof statusColors]
                    )} />
                    <CardTitle className="text-base">{camera.nome}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {camera.id}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {camera.cliente}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{camera.local}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Signal className="h-3.5 w-3.5" />
                    <span className="font-mono">{camera.ip}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{camera.modelo}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {camera.qualidade}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {camera.fps} FPS
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className={cn(
                    'text-xs font-medium',
                    camera.status === 'online' && 'text-green-600',
                    camera.status === 'offline' && 'text-red-600',
                    camera.status === 'warning' && 'text-yellow-600'
                  )}>
                    {statusLabels[camera.status as keyof typeof statusLabels]}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link to="/technician/live">
                        <Video className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link to="/technician/diagnostics">
                        <Wrench className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
