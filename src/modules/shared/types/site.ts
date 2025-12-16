export enum SiteType {
  HEADQUARTERS = 'HEADQUARTERS',
  BRANCH = 'BRANCH',
  STORE = 'STORE',
  WAREHOUSE = 'WAREHOUSE',
  OFFICE = 'OFFICE',
  FACTORY = 'FACTORY',
  DATACENTER = 'DATACENTER',
  OTHER = 'OTHER'
}

export enum SiteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  type: SiteType;
  status: SiteStatus;
  tenantId: string;
  tenantName: string;
  address: Address;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalAreas: number;
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

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

export const getSiteStatusLabel = (status: SiteStatus): string => {
  const labels: Record<SiteStatus, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    UNDER_CONSTRUCTION: 'Em Construção',
    MAINTENANCE: 'Em Manutenção'
  };
  return labels[status];
};

export const getSiteStatusColor = (status: SiteStatus): string => {
  const colors: Record<SiteStatus, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-300',
    INACTIVE: 'bg-gray-100 text-gray-800 border-gray-300',
    UNDER_CONSTRUCTION: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    MAINTENANCE: 'bg-orange-100 text-orange-800 border-orange-300'
  };
  return colors[status];
};

export const formatZipCode = (zipCode: string): string => {
  const cleaned = zipCode.replace(/\D/g, '');
  if (cleaned.length !== 8) return zipCode;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

export const isValidZipCode = (zipCode: string): boolean => {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.length === 8;
};
