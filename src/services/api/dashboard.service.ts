import { apiClient } from './client'

export interface DashboardMetrics {
  totalClientes: number
  clientesAtivos: number
  clientesSuspensos: number
  clientesTrial: number
  clientesHoje: number
  totalCameras: number
  camerasOnline: number
  camerasOffline: number
  camerasErro: number
  eventos24h: number
  eventosHoje: number
  storageUsado: number
  storageTotal: number
  storagePercentual: number
}

export interface ClientesPorPlano {
  name: string
  value: number
  color: string
}

export interface EventosIA {
  data: string
  lpr: number
  intrusao: number
  contagem: number
  outros: number
}

export interface TopCliente {
  id: string
  nome: string
  plano: string
  cameras: number
  eventos: number
}

export interface AlertaCritico {
  id: string
  tipo: string
  mensagem: string
  clienteNome: string
  cameraNome?: string
  timestamp: string
  severidade: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface ServidorIA {
  id: string
  nome: string
  status: 'ONLINE' | 'OFFLINE'
  cargaCPU: number
  cargaGPU: number
  memoriaUsada: number
  memoriaTotal: number
  camerasProcessando: number
}

class DashboardService {
  async obterMetricas(): Promise<DashboardMetrics> {
    return apiClient.get<DashboardMetrics>('/admin-master/dashboard/metrics')
  }

  async obterClientesPorPlano(): Promise<ClientesPorPlano[]> {
    return apiClient.get<ClientesPorPlano[]>('/admin-master/dashboard/clientes-por-plano')
  }

  async obterEventosIA(dias = 7): Promise<EventosIA[]> {
    return apiClient.get<EventosIA[]>('/admin-master/dashboard/eventos-ia', {
      params: { dias },
    })
  }

  async obterTopClientes(limit = 5): Promise<TopCliente[]> {
    return apiClient.get<TopCliente[]>('/admin-master/dashboard/top-clientes', {
      params: { limit },
    })
  }

  async obterAlertasCriticos(): Promise<AlertaCritico[]> {
    return apiClient.get<AlertaCritico[]>('/admin-master/dashboard/alertas-criticos')
  }

  async obterServidoresIA(): Promise<ServidorIA[]> {
    return apiClient.get<ServidorIA[]>('/admin-master/dashboard/servidores-ia')
  }
}

export const dashboardService = new DashboardService()
