export enum TenantPlan {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
  CANCELLED = 'CANCELLED'
}

export interface TenantLimits {
  maxCameras: number
  maxSites: number
  maxUsers: number
  retentionDays: number
  maxStreamQuality: 'SD' | 'HD' | 'FULLHD' | '4K'
  allowedAIModules: string[]
  storageGB: number
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface FiscalData {
  cnpj: string
  companyName: string
  stateRegistration?: string
  address: Address
}

export interface PrimaryContact {
  name: string
  email: string
  phone: string
  position?: string
}

export interface TenantStats {
  activeCameras: number
  sites: number
  users: number
  storageUsedGB: number
  eventsLast30Days: number
}

export interface Tenant {
  id: string
  name: string
  plan: TenantPlan
  status: TenantStatus
  limits: TenantLimits
  fiscalData: FiscalData
  primaryContact: PrimaryContact
  contractDate: string
  expirationDate: string
  createdAt: string
  updatedAt: string
  stats?: TenantStats
}
