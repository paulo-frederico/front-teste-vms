import type {
  AiModuleType,
  CameraAiConfig,
  GlobalAiConfig
} from './types/aiConfigTypes'

// Configuracoes globais de IA por tenant
export const GLOBAL_AI_CONFIGS: GlobalAiConfig[] = [
  {
    id: 'global-ai-001',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    defaultSensitivity: 70,
    modulesEnabled: ['intrusion', 'line_cross', 'lpr', 'people_count'],
    serverAssignment: 'auto',
    loadBalancing: 'least_load',
    maxCamerasPerModule: 50,
    createdAt: '2025-01-15T10:00:00-03:00',
    updatedAt: '2025-12-10T14:30:00-03:00'
  },
  {
    id: 'global-ai-002',
    tenantId: 'tenant-002',
    tenantName: 'Retail Park Brasil',
    defaultSensitivity: 75,
    modulesEnabled: ['intrusion', 'people_count', 'vehicle_count', 'loitering'],
    serverAssignment: 'manual',
    assignedServerId: 'srv-ia-core-01',
    assignedServerName: 'Cluster IA 01',
    loadBalancing: 'priority',
    maxCamerasPerModule: 100,
    createdAt: '2025-02-20T09:00:00-03:00',
    updatedAt: '2025-12-08T16:45:00-03:00'
  },
  {
    id: 'global-ai-003',
    tenantId: 'tenant-003',
    tenantName: 'Hospital Vida Plena',
    defaultSensitivity: 80,
    modulesEnabled: ['intrusion', 'line_cross', 'epi', 'loitering'],
    serverAssignment: 'auto',
    loadBalancing: 'round_robin',
    maxCamerasPerModule: 75,
    createdAt: '2025-03-10T11:00:00-03:00',
    updatedAt: '2025-12-05T10:20:00-03:00'
  }
]

// Configuracoes de IA por camera (mock)
export const CAMERA_AI_CONFIGS: CameraAiConfig[] = [
  {
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    siteId: 'site-001',
    siteName: 'Matriz Blumenau',
    globalSensitivity: 75,
    lastUpdated: '2025-12-10T09:30:00-03:00',
    updatedBy: 'admin@unifique.com.br',
    modules: [
      {
        id: 'mod-001-intrusion',
        type: 'intrusion',
        enabled: true,
        sensitivity: 80,
        zones: [
          {
            id: 'zone-001',
            name: 'Area Restrita',
            type: 'polygon',
            points: [
              { x: 10, y: 60 },
              { x: 40, y: 60 },
              { x: 40, y: 90 },
              { x: 10, y: 90 }
            ],
            color: '#ef4444',
            moduleType: 'intrusion'
          }
        ],
        schedule: {
          enabled: true,
          periods: [
            {
              id: 'period-001',
              days: ['mon', 'tue', 'wed', 'thu', 'fri'],
              startTime: '19:00',
              endTime: '07:00'
            },
            {
              id: 'period-002',
              days: ['sat', 'sun'],
              startTime: '00:00',
              endTime: '23:59'
            }
          ]
        },
        createdAt: '2025-06-01T10:00:00-03:00',
        updatedAt: '2025-12-10T09:30:00-03:00'
      },
      {
        id: 'mod-001-lpr',
        type: 'lpr',
        enabled: true,
        sensitivity: 85,
        zones: [
          {
            id: 'zone-002',
            name: 'Faixa de Leitura',
            type: 'rectangle',
            points: [
              { x: 20, y: 40 },
              { x: 80, y: 40 },
              { x: 80, y: 70 },
              { x: 20, y: 70 }
            ],
            color: '#3b82f6',
            moduleType: 'lpr'
          }
        ],
        createdAt: '2025-06-01T10:00:00-03:00',
        updatedAt: '2025-12-10T09:30:00-03:00'
      }
    ]
  },
  {
    cameraId: 'cam-002',
    cameraName: 'Estacionamento A',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    siteId: 'site-001',
    siteName: 'Matriz Blumenau',
    globalSensitivity: 70,
    lastUpdated: '2025-12-09T15:20:00-03:00',
    updatedBy: 'tecnico@unifique.com.br',
    modules: [
      {
        id: 'mod-002-vehicle',
        type: 'vehicle_count',
        enabled: true,
        sensitivity: 75,
        zones: [
          {
            id: 'zone-003',
            name: 'Linha Entrada',
            type: 'line',
            points: [
              { x: 10, y: 50 },
              { x: 90, y: 50 }
            ],
            color: '#8b5cf6',
            moduleType: 'vehicle_count'
          }
        ],
        createdAt: '2025-07-15T14:00:00-03:00',
        updatedAt: '2025-12-09T15:20:00-03:00'
      },
      {
        id: 'mod-002-loitering',
        type: 'loitering',
        enabled: true,
        sensitivity: 60,
        zones: [
          {
            id: 'zone-004',
            name: 'Area Monitorada',
            type: 'polygon',
            points: [
              { x: 5, y: 5 },
              { x: 95, y: 5 },
              { x: 95, y: 45 },
              { x: 5, y: 45 }
            ],
            color: '#ec4899',
            moduleType: 'loitering'
          }
        ],
        createdAt: '2025-07-15T14:00:00-03:00',
        updatedAt: '2025-12-09T15:20:00-03:00'
      }
    ]
  },
  {
    cameraId: 'cam-003',
    cameraName: 'Corredor CPD',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    siteId: 'site-001',
    siteName: 'Matriz Blumenau',
    globalSensitivity: 90,
    lastUpdated: '2025-12-08T11:00:00-03:00',
    updatedBy: 'seguranca@unifique.com.br',
    modules: [
      {
        id: 'mod-003-intrusion',
        type: 'intrusion',
        enabled: true,
        sensitivity: 95,
        zones: [
          {
            id: 'zone-005',
            name: 'Sala de Servidores',
            type: 'rectangle',
            points: [
              { x: 0, y: 0 },
              { x: 100, y: 0 },
              { x: 100, y: 100 },
              { x: 0, y: 100 }
            ],
            color: '#ef4444',
            moduleType: 'intrusion'
          }
        ],
        schedule: {
          enabled: true,
          periods: [
            {
              id: 'period-003',
              days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
              startTime: '00:00',
              endTime: '23:59'
            }
          ]
        },
        createdAt: '2025-05-10T08:00:00-03:00',
        updatedAt: '2025-12-08T11:00:00-03:00'
      },
      {
        id: 'mod-003-line',
        type: 'line_cross',
        enabled: true,
        sensitivity: 90,
        zones: [
          {
            id: 'zone-006',
            name: 'Acesso Porta Principal',
            type: 'line',
            points: [
              { x: 45, y: 10 },
              { x: 55, y: 90 }
            ],
            color: '#f59e0b',
            moduleType: 'line_cross'
          }
        ],
        createdAt: '2025-05-10T08:00:00-03:00',
        updatedAt: '2025-12-08T11:00:00-03:00'
      }
    ]
  },
  {
    cameraId: 'cam-004',
    cameraName: 'Area de Producao',
    tenantId: 'tenant-003',
    tenantName: 'Hospital Vida Plena',
    siteId: 'site-003',
    siteName: 'Centro Cirurgico',
    globalSensitivity: 85,
    lastUpdated: '2025-12-07T09:15:00-03:00',
    updatedBy: 'admin.hospital@vidaplena.com.br',
    modules: [
      {
        id: 'mod-004-epi',
        type: 'epi',
        enabled: true,
        sensitivity: 90,
        zones: [
          {
            id: 'zone-007',
            name: 'Entrada Centro Cirurgico',
            type: 'rectangle',
            points: [
              { x: 15, y: 20 },
              { x: 85, y: 20 },
              { x: 85, y: 80 },
              { x: 15, y: 80 }
            ],
            color: '#06b6d4',
            moduleType: 'epi'
          }
        ],
        createdAt: '2025-08-20T10:00:00-03:00',
        updatedAt: '2025-12-07T09:15:00-03:00'
      }
    ]
  },
  {
    cameraId: 'cam-005',
    cameraName: 'Portaria Shopping',
    tenantId: 'tenant-002',
    tenantName: 'Retail Park Brasil',
    siteId: 'site-002',
    siteName: 'Shopping Center',
    globalSensitivity: 72,
    lastUpdated: '2025-12-10T08:00:00-03:00',
    updatedBy: 'gerente@retailpark.com.br',
    modules: [
      {
        id: 'mod-005-people',
        type: 'people_count',
        enabled: true,
        sensitivity: 78,
        zones: [
          {
            id: 'zone-008',
            name: 'Linha Entrada Principal',
            type: 'line',
            points: [
              { x: 20, y: 30 },
              { x: 80, y: 30 }
            ],
            color: '#22c55e',
            moduleType: 'people_count'
          },
          {
            id: 'zone-009',
            name: 'Linha Saida Principal',
            type: 'line',
            points: [
              { x: 20, y: 70 },
              { x: 80, y: 70 }
            ],
            color: '#22c55e',
            moduleType: 'people_count'
          }
        ],
        createdAt: '2025-04-12T09:00:00-03:00',
        updatedAt: '2025-12-10T08:00:00-03:00'
      },
      {
        id: 'mod-005-loitering',
        type: 'loitering',
        enabled: true,
        sensitivity: 65,
        zones: [
          {
            id: 'zone-010',
            name: 'Area Caixas Eletronicos',
            type: 'polygon',
            points: [
              { x: 60, y: 10 },
              { x: 95, y: 10 },
              { x: 95, y: 50 },
              { x: 60, y: 50 }
            ],
            color: '#ec4899',
            moduleType: 'loitering'
          }
        ],
        createdAt: '2025-04-12T09:00:00-03:00',
        updatedAt: '2025-12-10T08:00:00-03:00'
      }
    ]
  }
]

// Funcoes auxiliares
export function getCameraAiConfig(cameraId: string): CameraAiConfig | undefined {
  return CAMERA_AI_CONFIGS.find(config => config.cameraId === cameraId)
}

export function getGlobalAiConfig(tenantId: string): GlobalAiConfig | undefined {
  return GLOBAL_AI_CONFIGS.find(config => config.tenantId === tenantId)
}

export function getCamerasByTenant(tenantId: string): CameraAiConfig[] {
  return CAMERA_AI_CONFIGS.filter(config => config.tenantId === tenantId)
}

export function getEnabledModulesCount(): Record<AiModuleType, number> {
  const counts: Record<AiModuleType, number> = {
    intrusion: 0,
    line_cross: 0,
    lpr: 0,
    people_count: 0,
    vehicle_count: 0,
    loitering: 0,
    epi: 0
  }

  CAMERA_AI_CONFIGS.forEach(config => {
    config.modules.forEach(module => {
      if (module.enabled) {
        counts[module.type]++
      }
    })
  })

  return counts
}

export function getTotalZonesCount(): number {
  return CAMERA_AI_CONFIGS.reduce((total, config) => {
    return total + config.modules.reduce((modTotal, module) => modTotal + module.zones.length, 0)
  }, 0)
}

export function getAverageGlobalSensitivity(): number {
  const total = CAMERA_AI_CONFIGS.reduce((sum, config) => sum + config.globalSensitivity, 0)
  return Math.round(total / CAMERA_AI_CONFIGS.length)
}

export function buildAiConfigKpis() {
  const moduleCounts = getEnabledModulesCount()
  const totalModules = Object.values(moduleCounts).reduce((a, b) => a + b, 0)

  return {
    totalCameras: CAMERA_AI_CONFIGS.length,
    totalModulesActive: totalModules,
    totalZones: getTotalZonesCount(),
    avgSensitivity: getAverageGlobalSensitivity(),
    moduleCounts
  }
}
