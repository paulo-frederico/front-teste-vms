// Mock data para Níveis de Acesso Customizados

export interface AccessPermission {
  id: string
  name: string
  description: string
  category: 'cameras' | 'users' | 'infrastructure' | 'analytics' | 'system'
}

export interface AccessLevel {
  id: string
  name: string
  description: string
  enabled: boolean
  isCustom: boolean
  baseLevel?: string // Nível que este foi baseado
  permissions: AccessPermission[]
  inheritedPermissions: AccessPermission[] // Permissões herdadas do nível base
  createdAt: string
  updatedAt: string
  createdBy?: string
}

// Permissões disponíveis agrupadas por categoria
export const AVAILABLE_PERMISSIONS: Record<string, AccessPermission[]> = {
  cameras: [
    {
      id: 'camera-view',
      name: 'Visualizar câmeras',
      description: 'Acesso para visualizar feed de câmeras',
      category: 'cameras'
    },
    {
      id: 'camera-configure',
      name: 'Configurar câmeras',
      description: 'Alterar configurações de câmeras',
      category: 'cameras'
    },
    {
      id: 'camera-delete',
      name: 'Deletar câmeras',
      description: 'Remover câmeras do sistema',
      category: 'cameras'
    },
    {
      id: 'camera-livestream',
      name: 'Visualizar ao vivo',
      description: 'Acesso ao live view com qualidade completa',
      category: 'cameras'
    },
    {
      id: 'camera-playback',
      name: 'Reproduzir gravações',
      description: 'Acessar arquivo de gravações',
      category: 'cameras'
    }
  ],
  users: [
    {
      id: 'user-view',
      name: 'Visualizar usuários',
      description: 'Listar usuários do sistema',
      category: 'users'
    },
    {
      id: 'user-create',
      name: 'Criar usuários',
      description: 'Adicionar novos usuários',
      category: 'users'
    },
    {
      id: 'user-edit',
      name: 'Editar usuários',
      description: 'Modificar dados de usuários',
      category: 'users'
    },
    {
      id: 'user-delete',
      name: 'Deletar usuários',
      description: 'Remover usuários do sistema',
      category: 'users'
    },
    {
      id: 'user-assign-role',
      name: 'Atribuir papéis',
      description: 'Associar papéis e permissões a usuários',
      category: 'users'
    }
  ],
  infrastructure: [
    {
      id: 'server-view',
      name: 'Visualizar servidores',
      description: 'Ver status e métricas de servidores',
      category: 'infrastructure'
    },
    {
      id: 'server-configure',
      name: 'Configurar servidores',
      description: 'Alterar configurações de infraestrutura',
      category: 'infrastructure'
    },
    {
      id: 'server-reboot',
      name: 'Reiniciar servidores',
      description: 'Reiniciar servidores (impacto crítico)',
      category: 'infrastructure'
    },
    {
      id: 'backup-view',
      name: 'Visualizar backups',
      description: 'Acessar histórico e status de backups',
      category: 'infrastructure'
    }
  ],
  analytics: [
    {
      id: 'analytics-view',
      name: 'Visualizar análises',
      description: 'Acessar dashboard de análises',
      category: 'analytics'
    },
    {
      id: 'alerts-configure',
      name: 'Configurar alertas',
      description: 'Criar e modificar regras de alerta',
      category: 'analytics'
    },
    {
      id: 'ai-view',
      name: 'Visualizar IA',
      description: 'Ver resultados de análise de IA',
      category: 'analytics'
    },
    {
      id: 'ai-configure',
      name: 'Configurar IA',
      description: 'Alterar modelos e configurações de IA',
      category: 'analytics'
    }
  ],
  system: [
    {
      id: 'audit-view',
      name: 'Visualizar auditoria',
      description: 'Acessar logs de auditoria',
      category: 'system'
    },
    {
      id: 'system-configure',
      name: 'Configurar sistema',
      description: 'Acesso a configurações globais',
      category: 'system'
    },
    {
      id: 'admin-access',
      name: 'Acesso admin master',
      description: 'Todas as permissões do sistema',
      category: 'system'
    }
  ]
}

// Níveis de acesso padrão
export const DEFAULT_ACCESS_LEVELS: AccessLevel[] = [
  {
    id: 'level-admin',
    name: 'Admin Master',
    description: 'Acesso total ao sistema',
    enabled: true,
    isCustom: false,
    permissions: Object.values(AVAILABLE_PERMISSIONS).flat(),
    inheritedPermissions: [],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'level-tech',
    name: 'Técnico',
    description: 'Acesso para suporte técnico',
    enabled: true,
    isCustom: false,
    permissions: [
      ...AVAILABLE_PERMISSIONS['cameras'].slice(0, 2),
      ...AVAILABLE_PERMISSIONS['users'].slice(0, 1),
      AVAILABLE_PERMISSIONS['infrastructure'][0],
      AVAILABLE_PERMISSIONS['system'][0]
    ],
    inheritedPermissions: [],
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'level-viewer',
    name: 'Visualizador',
    description: 'Acesso apenas para visualização',
    enabled: true,
    isCustom: false,
    permissions: [
      AVAILABLE_PERMISSIONS['cameras'][0],
      AVAILABLE_PERMISSIONS['cameras'][3],
      AVAILABLE_PERMISSIONS['cameras'][4],
      AVAILABLE_PERMISSIONS['analytics'][0],
      AVAILABLE_PERMISSIONS['analytics'][2]
    ],
    inheritedPermissions: [],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system'
  },
  {
    id: 'level-custom-1',
    name: 'Gerenciador de Câmeras',
    description: 'Acesso customizado para gerenciamento de câmeras',
    enabled: true,
    isCustom: true,
    baseLevel: 'level-tech',
    permissions: [
      ...AVAILABLE_PERMISSIONS['cameras'],
      AVAILABLE_PERMISSIONS['infrastructure'][0]
    ],
    inheritedPermissions: [
      AVAILABLE_PERMISSIONS['system'][0]
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com'
  }
]

export const MOCK_ACCESS_LEVELS = DEFAULT_ACCESS_LEVELS
