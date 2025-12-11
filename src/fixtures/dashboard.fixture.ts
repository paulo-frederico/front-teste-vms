import type {
  AlertaCritico,
  ClientesPorPlano,
  DashboardMetrics,
  EventosIA,
  ServidorIA,
  TopCliente,
} from '@/services/api/dashboard.service'

export const mockDashboardMetrics: DashboardMetrics = {
  totalClientes: 245,
  clientesAtivos: 198,
  clientesSuspensos: 12,
  clientesTrial: 35,
  clientesHoje: 3,
  totalCameras: 1234,
  camerasOnline: 1189,
  camerasOffline: 32,
  camerasErro: 13,
  eventos24h: 5678,
  eventosHoje: 234,
  storageUsado: 45,
  storageTotal: 100,
  storagePercentual: 45,
}

export const mockClientesPorPlano: ClientesPorPlano[] = [
  { name: 'Básico', value: 120, color: '#3b82f6' },
  { name: 'Profissional', value: 85, color: '#10b981' },
  { name: 'Enterprise', value: 40, color: '#f59e0b' },
]

export const mockEventosIA: EventosIA[] = [
  { data: '05/12', lpr: 234, intrusao: 45, contagem: 123, outros: 34 },
  { data: '06/12', lpr: 267, intrusao: 52, contagem: 145, outros: 28 },
  { data: '07/12', lpr: 298, intrusao: 38, contagem: 156, outros: 41 },
  { data: '08/12', lpr: 312, intrusao: 61, contagem: 134, outros: 37 },
  { data: '09/12', lpr: 289, intrusao: 47, contagem: 167, outros: 45 },
  { data: '10/12', lpr: 345, intrusao: 55, contagem: 178, outros: 52 },
  { data: '11/12', lpr: 321, intrusao: 49, contagem: 189, outros: 48 },
]

export const mockTopClientes: TopCliente[] = [
  { id: '3', nome: 'Rede de Lojas 123', plano: 'Enterprise', cameras: 156, eventos: 8934 },
  { id: '5', nome: 'Shopping Center ABC', plano: 'Enterprise', cameras: 142, eventos: 7821 },
  { id: '8', nome: 'Indústria XYZ', plano: 'Professional', cameras: 98, eventos: 5432 },
  { id: '12', nome: 'Hospital São José', plano: 'Professional', cameras: 87, eventos: 4567 },
  { id: '1', nome: 'Empresa ABC Ltda', plano: 'Professional', cameras: 24, eventos: 1523 },
]

export const mockAlertasCriticos: AlertaCritico[] = [
  {
    id: '1',
    tipo: 'Câmera Offline',
    mensagem: 'Câmera CAM-045 está offline há 2 horas',
    clienteNome: 'Empresa ABC Ltda',
    cameraNome: 'CAM-045 - Entrada Principal',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severidade: 'HIGH',
  },
  {
    id: '2',
    tipo: 'IA Falhou',
    mensagem: 'Módulo LPR falhou em 3 câmeras',
    clienteNome: 'Rede de Lojas 123',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severidade: 'HIGH',
  },
  {
    id: '3',
    tipo: 'Storage Crítico',
    mensagem: 'Storage em 92% de uso',
    clienteNome: 'Shopping Center ABC',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    severidade: 'MEDIUM',
  },
]

export const mockServidoresIA: ServidorIA[] = [
  {
    id: 'srv-1',
    nome: 'IA-Server-01',
    status: 'ONLINE',
    cargaCPU: 45,
    cargaGPU: 67,
    memoriaUsada: 24,
    memoriaTotal: 32,
    camerasProcessando: 45,
  },
  {
    id: 'srv-2',
    nome: 'IA-Server-02',
    status: 'ONLINE',
    cargaCPU: 52,
    cargaGPU: 73,
    memoriaUsada: 28,
    memoriaTotal: 32,
    camerasProcessando: 52,
  },
  {
    id: 'srv-3',
    nome: 'IA-Server-03',
    status: 'ONLINE',
    cargaCPU: 38,
    cargaGPU: 61,
    memoriaUsada: 20,
    memoriaTotal: 32,
    camerasProcessando: 38,
  },
]
