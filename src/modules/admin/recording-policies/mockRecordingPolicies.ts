import type {
  StoragePolicy,
  CameraRecordingConfig,
  RecordingMode
} from './types/recordingTypes'

export const STORAGE_POLICIES: StoragePolicy[] = [
  {
    id: 'policy-001',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    name: 'Politica Padrao Enterprise',
    description: 'Politica de gravacao para clientes enterprise com alta retencao',
    defaultRetentionDays: 90,
    maxRetentionDays: 365,
    recordingMode: 'continuous',
    defaultQuality: 'FullHD',
    storageQuotaGB: 5000,
    usedStorageGB: 3200,
    alertThresholdPercent: 80,
    retentionPolicies: [
      {
        id: 'ret-001',
        name: 'Acesso Rapido',
        retentionDays: 30,
        storageTier: 'hot',
        autoArchive: true,
        archiveAfterDays: 30
      },
      {
        id: 'ret-002',
        name: 'Arquivo Normal',
        retentionDays: 60,
        storageTier: 'warm',
        autoArchive: true,
        archiveAfterDays: 60
      },
      {
        id: 'ret-003',
        name: 'Arquivo Frio',
        retentionDays: 90,
        storageTier: 'cold',
        autoArchive: false
      }
    ],
    schedules: [
      {
        id: 'sched-001',
        name: 'Horario Comercial HD',
        enabled: true,
        periods: [
          {
            id: 'period-001',
            days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            startTime: '08:00',
            endTime: '18:00',
            mode: 'continuous',
            quality: 'FullHD'
          },
          {
            id: 'period-002',
            days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            startTime: '18:00',
            endTime: '08:00',
            mode: 'event_based',
            quality: 'HD'
          }
        ]
      }
    ],
    exportPolicy: {
      id: 'exp-001',
      name: 'Exportacao Padrao',
      format: 'mp4',
      maxDurationMinutes: 60,
      watermarkEnabled: true,
      watermarkText: 'VMS Unifique - {tenant} - {date}',
      permission: 'admin_only',
      requireApproval: false,
      auditEnabled: true
    },
    createdAt: '2025-01-15T10:00:00-03:00',
    updatedAt: '2025-12-10T14:30:00-03:00'
  },
  {
    id: 'policy-002',
    tenantId: 'tenant-002',
    tenantName: 'Retail Park Brasil',
    name: 'Politica Varejo',
    description: 'Otimizada para lojas e centros comerciais',
    defaultRetentionDays: 30,
    maxRetentionDays: 90,
    recordingMode: 'mixed',
    defaultQuality: 'HD',
    storageQuotaGB: 2000,
    usedStorageGB: 1450,
    alertThresholdPercent: 85,
    retentionPolicies: [
      {
        id: 'ret-004',
        name: 'Acesso Imediato',
        retentionDays: 7,
        storageTier: 'hot',
        autoArchive: true,
        archiveAfterDays: 7
      },
      {
        id: 'ret-005',
        name: 'Arquivo Mensal',
        retentionDays: 30,
        storageTier: 'warm',
        autoArchive: false
      }
    ],
    schedules: [
      {
        id: 'sched-002',
        name: 'Horario Loja',
        enabled: true,
        periods: [
          {
            id: 'period-003',
            days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            startTime: '09:00',
            endTime: '22:00',
            mode: 'continuous',
            quality: 'HD'
          },
          {
            id: 'period-004',
            days: ['sun'],
            startTime: '10:00',
            endTime: '20:00',
            mode: 'continuous',
            quality: 'HD'
          }
        ]
      }
    ],
    exportPolicy: {
      id: 'exp-002',
      name: 'Exportacao Restrita',
      format: 'mp4',
      maxDurationMinutes: 30,
      watermarkEnabled: true,
      watermarkText: 'Retail Park - Confidencial',
      permission: 'restricted',
      requireApproval: true,
      auditEnabled: true
    },
    createdAt: '2025-02-20T09:00:00-03:00',
    updatedAt: '2025-12-08T16:45:00-03:00'
  },
  {
    id: 'policy-003',
    tenantId: 'tenant-003',
    tenantName: 'Hospital Vida Plena',
    name: 'Politica Saude',
    description: 'Conformidade com regulamentacoes de saude e LGPD',
    defaultRetentionDays: 180,
    maxRetentionDays: 730,
    recordingMode: 'continuous',
    defaultQuality: '4K',
    storageQuotaGB: 10000,
    usedStorageGB: 6800,
    alertThresholdPercent: 75,
    retentionPolicies: [
      {
        id: 'ret-006',
        name: 'Acesso Critico',
        retentionDays: 90,
        storageTier: 'hot',
        autoArchive: true,
        archiveAfterDays: 90
      },
      {
        id: 'ret-007',
        name: 'Arquivo Legal',
        retentionDays: 180,
        storageTier: 'cold',
        autoArchive: true,
        archiveAfterDays: 365
      },
      {
        id: 'ret-008',
        name: 'Arquivo Permanente',
        retentionDays: 730,
        storageTier: 'archive',
        autoArchive: false
      }
    ],
    schedules: [],
    exportPolicy: {
      id: 'exp-003',
      name: 'Exportacao Controlada',
      format: 'mkv',
      maxDurationMinutes: 120,
      watermarkEnabled: true,
      watermarkText: 'Hospital Vida Plena - Documento Legal',
      permission: 'admin_only',
      requireApproval: true,
      auditEnabled: true
    },
    createdAt: '2025-03-10T11:00:00-03:00',
    updatedAt: '2025-12-05T10:20:00-03:00'
  }
]

export const CAMERA_RECORDING_CONFIGS: CameraRecordingConfig[] = [
  {
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    siteId: 'site-001',
    siteName: 'Matriz Blumenau',
    recordingEnabled: true,
    mode: 'continuous',
    quality: 'FullHD',
    retentionDays: 90,
    storageUsedGB: 245,
    lastRecordingAt: '2025-12-10T09:30:00-03:00',
    status: 'recording'
  },
  {
    cameraId: 'cam-002',
    cameraName: 'Estacionamento A',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    siteId: 'site-001',
    siteName: 'Matriz Blumenau',
    recordingEnabled: true,
    mode: 'event_based',
    quality: 'HD',
    retentionDays: 30,
    storageUsedGB: 78,
    lastRecordingAt: '2025-12-10T09:28:00-03:00',
    status: 'recording'
  },
  {
    cameraId: 'cam-003',
    cameraName: 'Corredor CPD',
    tenantId: 'tenant-001',
    tenantName: 'Unifique Headquarters',
    siteId: 'site-001',
    siteName: 'Matriz Blumenau',
    recordingEnabled: true,
    mode: 'continuous',
    quality: '4K',
    retentionDays: 180,
    storageUsedGB: 520,
    lastRecordingAt: '2025-12-10T09:30:00-03:00',
    status: 'recording'
  },
  {
    cameraId: 'cam-004',
    cameraName: 'Area de Producao',
    tenantId: 'tenant-003',
    tenantName: 'Hospital Vida Plena',
    siteId: 'site-003',
    siteName: 'Centro Cirurgico',
    recordingEnabled: true,
    mode: 'continuous',
    quality: '4K',
    retentionDays: 365,
    storageUsedGB: 890,
    lastRecordingAt: '2025-12-10T09:30:00-03:00',
    status: 'recording'
  },
  {
    cameraId: 'cam-005',
    cameraName: 'Portaria Shopping',
    tenantId: 'tenant-002',
    tenantName: 'Retail Park Brasil',
    siteId: 'site-002',
    siteName: 'Shopping Center',
    recordingEnabled: true,
    mode: 'mixed',
    quality: 'HD',
    retentionDays: 30,
    scheduleId: 'sched-002',
    storageUsedGB: 156,
    lastRecordingAt: '2025-12-10T09:25:00-03:00',
    status: 'scheduled'
  },
  {
    cameraId: 'cam-006',
    cameraName: 'Deposito Fundos',
    tenantId: 'tenant-002',
    tenantName: 'Retail Park Brasil',
    siteId: 'site-002',
    siteName: 'Shopping Center',
    recordingEnabled: false,
    mode: 'event_based',
    quality: 'SD',
    retentionDays: 7,
    storageUsedGB: 12,
    status: 'stopped'
  }
]

// Funcoes auxiliares
export function getStoragePolicy(policyId: string): StoragePolicy | undefined {
  return STORAGE_POLICIES.find(p => p.id === policyId)
}

export function getStoragePolicyByTenant(tenantId: string): StoragePolicy | undefined {
  return STORAGE_POLICIES.find(p => p.tenantId === tenantId)
}

export function getCameraRecordingConfig(cameraId: string): CameraRecordingConfig | undefined {
  return CAMERA_RECORDING_CONFIGS.find(c => c.cameraId === cameraId)
}

export function getCamerasByRecordingStatus(status: CameraRecordingConfig['status']): CameraRecordingConfig[] {
  return CAMERA_RECORDING_CONFIGS.filter(c => c.status === status)
}

export function buildRecordingKpis() {
  const totalCameras = CAMERA_RECORDING_CONFIGS.length
  const recordingActive = CAMERA_RECORDING_CONFIGS.filter(c => c.status === 'recording').length
  const totalStorageUsed = CAMERA_RECORDING_CONFIGS.reduce((sum, c) => sum + c.storageUsedGB, 0)
  const totalStorageQuota = STORAGE_POLICIES.reduce((sum, p) => sum + p.storageQuotaGB, 0)

  const modeDistribution: Record<RecordingMode, number> = {
    continuous: 0,
    event_based: 0,
    scheduled: 0,
    mixed: 0
  }

  CAMERA_RECORDING_CONFIGS.forEach(c => {
    if (c.recordingEnabled) {
      modeDistribution[c.mode]++
    }
  })

  return {
    totalCameras,
    recordingActive,
    recordingStopped: totalCameras - recordingActive,
    totalStorageUsedGB: totalStorageUsed,
    totalStorageQuotaGB: totalStorageQuota,
    storageUsagePercent: Math.round((totalStorageUsed / totalStorageQuota) * 100),
    modeDistribution,
    totalPolicies: STORAGE_POLICIES.length
  }
}
