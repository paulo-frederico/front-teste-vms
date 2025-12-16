/**
 * Tipos para Areas (Zonas/Setores)
 * Areas são subdivisões de Sites onde câmeras estão instaladas
 */

export enum AreaType {
  RECEPTION = 'RECEPTION',         // Recepção
  PARKING = 'PARKING',             // Estacionamento
  PRODUCTION = 'PRODUCTION',       // Produção
  WAREHOUSE = 'WAREHOUSE',         // Almoxarifado
  HALLWAY = 'HALLWAY',             // Corredor
  ROOM = 'ROOM',                   // Sala
  EXTERNAL = 'EXTERNAL',           // Área Externa
  ENTRANCE = 'ENTRANCE',           // Entrada
  EXIT = 'EXIT',                   // Saída
  LOADING_DOCK = 'LOADING_DOCK',   // Doca de Carga
  CAFETERIA = 'CAFETERIA',         // Refeitório
  RESTROOM = 'RESTROOM',           // Banheiro
  STAIRS = 'STAIRS',               // Escada
  ELEVATOR = 'ELEVATOR',           // Elevador
  OTHER = 'OTHER'                  // Outro
}

export enum AreaStatus {
  ACTIVE = 'ACTIVE',               // Ativa
  INACTIVE = 'INACTIVE',           // Inativa
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION', // Em construção
  RESTRICTED = 'RESTRICTED'        // Acesso Restrito
}

/**
 * Area (Zona/Setor)
 */
export interface Area {
  id: string;
  name: string;
  description?: string;
  type: AreaType;
  status: AreaStatus;

  // Relacionamento
  tenantId: string;
  tenantName: string;
  siteId: string;
  siteName: string;

  // Características
  floor?: string;                  // Andar (ex: "Térreo", "1º Andar", "Subsolo")
  capacity?: number;               // Capacidade de pessoas
  squareMeters?: number;           // Área em m²

  // Estatísticas
  totalCameras: number;            // Total de câmeras
  onlineCameras: number;           // Câmeras online
  offlineCameras: number;          // Câmeras offline

  // Auditoria
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

/**
 * Helper: Obter label do tipo de área
 */
export const getAreaTypeLabel = (type: AreaType): string => {
  const labels: Record<AreaType, string> = {
    RECEPTION: 'Recepção',
    PARKING: 'Estacionamento',
    PRODUCTION: 'Produção',
    WAREHOUSE: 'Almoxarifado',
    HALLWAY: 'Corredor',
    ROOM: 'Sala',
    EXTERNAL: 'Área Externa',
    ENTRANCE: 'Entrada',
    EXIT: 'Saída',
    LOADING_DOCK: 'Doca de Carga',
    CAFETERIA: 'Refeitório',
    RESTROOM: 'Banheiro',
    STAIRS: 'Escada',
    ELEVATOR: 'Elevador',
    OTHER: 'Outro'
  };
  return labels[type];
};

/**
 * Helper: Obter label do status da área
 */
export const getAreaStatusLabel = (status: AreaStatus): string => {
  const labels: Record<AreaStatus, string> = {
    ACTIVE: 'Ativa',
    INACTIVE: 'Inativa',
    UNDER_CONSTRUCTION: 'Em Construção',
    RESTRICTED: 'Acesso Restrito'
  };
  return labels[status];
};

/**
 * Helper: Obter cor do badge de status
 */
export const getAreaStatusColor = (status: AreaStatus): string => {
  const colors: Record<AreaStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-300',
    INACTIVE: 'bg-gray-100 text-gray-800 border-gray-300',
    UNDER_CONSTRUCTION: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    RESTRICTED: 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[status];
};

/**
 * Helper: Obter ícone por tipo de área
 */
export const getAreaTypeIcon = (type: AreaType): string => {
  const icons: Record<AreaType, string> = {
    RECEPTION: '🏢',
    PARKING: '🅿️',
    PRODUCTION: '🏭',
    WAREHOUSE: '📦',
    HALLWAY: '🚪',
    ROOM: '🚪',
    EXTERNAL: '🌳',
    ENTRANCE: '🚪',
    EXIT: '🚪',
    LOADING_DOCK: '🚚',
    CAFETERIA: '🍽️',
    RESTROOM: '🚻',
    STAIRS: '🪜',
    ELEVATOR: '🛗',
    OTHER: '📍'
  };
  return icons[type];
};
