/**
 * Tipos para Sites (Locais Físicos)
 * Sites são locais físicos onde câmeras estão instaladas
 */

export enum SiteType {
  HEADQUARTERS = 'HEADQUARTERS',   // Matriz
  BRANCH = 'BRANCH',               // Filial
  STORE = 'STORE',                 // Loja
  WAREHOUSE = 'WAREHOUSE',         // Galpão/Armazém
  OFFICE = 'OFFICE',               // Escritório
  FACTORY = 'FACTORY',             // Fábrica
  DATACENTER = 'DATACENTER',       // Data Center
  OTHER = 'OTHER'                  // Outro
}

export enum SiteStatus {
  ACTIVE = 'ACTIVE',               // Ativo
  INACTIVE = 'INACTIVE',           // Inativo
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION', // Em construção
  MAINTENANCE = 'MAINTENANCE'      // Em manutenção
}

/**
 * Endereço completo
 */
export interface Address {
  zipCode: string;                 // CEP (formato: 00000-000)
  street: string;                  // Logradouro
  number: string;                  // Número
  complement?: string;             // Complemento
  neighborhood: string;            // Bairro
  city: string;                    // Cidade
  state: string;                   // Estado (UF)
  country: string;                 // País (padrão: Brasil)
  latitude?: number;               // Latitude (para mapa futuro)
  longitude?: number;              // Longitude (para mapa futuro)
}

/**
 * Site (Local Físico)
 */
export interface Site {
  id: string;
  name: string;
  description?: string;
  type: SiteType;
  status: SiteStatus;

  // Relacionamento
  tenantId: string;
  tenantName: string;

  // Endereço
  address: Address;

  // Contato
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;

  // Estatísticas
  totalAreas: number;              // Total de áreas
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
 * Helper: Obter label do tipo de site
 */
export const getSiteTypeLabel = (type: SiteType): string => {
  const labels: Record<SiteType, string> = {
    HEADQUARTERS: 'Matriz',
    BRANCH: 'Filial',
    STORE: 'Loja',
    WAREHOUSE: 'Galpão/Armazém',
    OFFICE: 'Escritório',
    FACTORY: 'Fábrica',
    DATACENTER: 'Data Center',
    OTHER: 'Outro'
  };
  return labels[type];
};

/**
 * Helper: Obter label do status do site
 */
export const getSiteStatusLabel = (status: SiteStatus): string => {
  const labels: Record<SiteStatus, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    UNDER_CONSTRUCTION: 'Em Construção',
    MAINTENANCE: 'Em Manutenção'
  };
  return labels[status];
};

/**
 * Helper: Obter cor do badge de status
 */
export const getSiteStatusColor = (status: SiteStatus): string => {
  const colors: Record<SiteStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-300',
    INACTIVE: 'bg-gray-100 text-gray-800 border-gray-300',
    UNDER_CONSTRUCTION: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    MAINTENANCE: 'bg-orange-100 text-orange-800 border-orange-300'
  };
  return colors[status];
};

/**
 * Helper: Formatar CEP (00000-000)
 */
export const formatZipCode = (zipCode: string): string => {
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length !== 8) return zipCode;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

/**
 * Helper: Validar CEP
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.length === 8;
};
