export type NotificationChannel = 'push' | 'email' | 'sms' | 'webhook'
export type NotificationSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type EscalationAction = 'none' | 'repeat' | 'call' | 'ticket'

export type NotificationProfile = {
  id: string
  name: string
  description: string
  enabled: boolean
  createdAt: string
  updatedAt: string
  channels: NotificationChannel[]
  settings: {
    push?: {
      enabled: boolean
      sound: boolean
      vibration: boolean
    }
    email?: {
      enabled: boolean
      format: 'html' | 'text'
      includeAttachments: boolean
    }
    sms?: {
      enabled: boolean
      maxPerDay: number
    }
    webhook?: {
      enabled: boolean
      url?: string
      retryAttempts: number
    }
  }
  severityRules: {
    [key in NotificationSeverity]?: {
      channels: NotificationChannel[]
      escalation?: {
        enabled: boolean
        delayMinutes: number
        action: EscalationAction
      }
    }
  }
  recipients: NotificationRecipient[]
  schedules?: NotificationSchedule[]
}

export type NotificationRecipient = {
  id: string
  name: string
  email?: string
  phone?: string
  role: string
  priority: 'primary' | 'secondary' | 'tertiary'
}

export type NotificationSchedule = {
  id: string
  name: string
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
  startTime: string
  endTime: string
  enabled: boolean
}

export const MOCK_NOTIFICATION_PROFILES: NotificationProfile[] = [
  {
    id: 'profile-001',
    name: 'Alertas Críticos - 24/7',
    description: 'Notificações de eventos críticos em tempo integral',
    enabled: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
    channels: ['push', 'email', 'sms'],
    settings: {
      push: {
        enabled: true,
        sound: true,
        vibration: true
      },
      email: {
        enabled: true,
        format: 'html',
        includeAttachments: true
      },
      sms: {
        enabled: true,
        maxPerDay: 50
      }
    },
    severityRules: {
      critical: {
        channels: ['push', 'email', 'sms'],
        escalation: {
          enabled: true,
          delayMinutes: 5,
          action: 'call'
        }
      },
      high: {
        channels: ['push', 'email'],
        escalation: {
          enabled: true,
          delayMinutes: 15,
          action: 'ticket'
        }
      },
      medium: {
        channels: ['email']
      },
      low: {
        channels: ['push']
      }
    },
    recipients: [
      {
        id: 'rec-001',
        name: 'João Silva - Gerente',
        email: 'joao@unifique.com',
        phone: '+5511987654321',
        role: 'MANAGER',
        priority: 'primary'
      },
      {
        id: 'rec-002',
        name: 'Maria Santos - Técnica',
        email: 'maria@unifique.com',
        phone: '+5511987654322',
        role: 'TECHNICIAN',
        priority: 'secondary'
      }
    ],
    schedules: [
      {
        id: 'sch-001',
        name: 'Comercial',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '08:00',
        endTime: '18:00',
        enabled: true
      },
      {
        id: 'sch-002',
        name: 'Fim de Semana',
        days: ['saturday', 'sunday'],
        startTime: '00:00',
        endTime: '23:59',
        enabled: true
      }
    ]
  },
  {
    id: 'profile-002',
    name: 'Alertas Operacionais',
    description: 'Alertas de operação durante horário comercial',
    enabled: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    channels: ['email', 'push'],
    settings: {
      push: {
        enabled: true,
        sound: false,
        vibration: true
      },
      email: {
        enabled: true,
        format: 'html',
        includeAttachments: false
      }
    },
    severityRules: {
      critical: {
        channels: ['push', 'email']
      },
      high: {
        channels: ['email']
      },
      medium: {
        channels: ['email']
      }
    },
    recipients: [
      {
        id: 'rec-003',
        name: 'Pedro Costa - Supervisor',
        email: 'pedro@unifique.com',
        phone: '+5511987654323',
        role: 'SUPERVISOR',
        priority: 'primary'
      }
    ],
    schedules: [
      {
        id: 'sch-003',
        name: 'Horário Comercial',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '08:00',
        endTime: '18:00',
        enabled: true
      }
    ]
  },
  {
    id: 'profile-003',
    name: 'Reportes Diários',
    description: 'Resumo diário de eventos e estatísticas',
    enabled: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    channels: ['email'],
    settings: {
      email: {
        enabled: true,
        format: 'html',
        includeAttachments: true
      }
    },
    severityRules: {
      critical: {
        channels: ['email']
      },
      high: {
        channels: ['email']
      },
      medium: {
        channels: ['email']
      },
      low: {
        channels: ['email']
      }
    },
    recipients: [
      {
        id: 'rec-004',
        name: 'Gerência Geral',
        email: 'gerencia@unifique.com',
        role: 'MANAGER',
        priority: 'primary'
      }
    ],
    schedules: [
      {
        id: 'sch-004',
        name: 'Diariamente',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        startTime: '09:00',
        endTime: '09:05',
        enabled: true
      }
    ]
  }
]
