export enum AreaType {
  RECEPTION = 'RECEPTION',
  PARKING = 'PARKING',
  PRODUCTION = 'PRODUCTION',
  WAREHOUSE = 'WAREHOUSE',
  HALLWAY = 'HALLWAY',
  ROOM = 'ROOM',
  EXTERNAL = 'EXTERNAL',
  ENTRANCE = 'ENTRANCE',
  EXIT = 'EXIT',
  LOADING_DOCK = 'LOADING_DOCK',
  CAFETERIA = 'CAFETERIA',
  RESTROOM = 'RESTROOM',
  STAIRS = 'STAIRS',
  ELEVATOR = 'ELEVATOR',
  OTHER = 'OTHER'
}

export enum AreaStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  RESTRICTED = 'RESTRICTED'
}

export interface Area {
  id: string;
  name: string;
  description?: string;
  type: AreaType;
  status: AreaStatus;
  tenantId: string;
  tenantName: string;
  siteId: string;
  siteName: string;
  floor?: string;
  capacity?: number;
  squareMeters?: number;
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

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

export const getAreaStatusLabel = (status: AreaStatus): string => {
  const labels: Record<AreaStatus, string> = {
    ACTIVE: 'Ativa',
    INACTIVE: 'Inativa',
    UNDER_CONSTRUCTION: 'Em Construção',
    RESTRICTED: 'Acesso Restrito'
  };
  return labels[status];
};

export const getAreaStatusColor = (status: AreaStatus): string => {
  const colors: Record<AreaStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-300',
    INACTIVE: 'bg-gray-100 text-gray-800 border-gray-300',
    UNDER_CONSTRUCTION: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    RESTRICTED: 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[status];
};

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
