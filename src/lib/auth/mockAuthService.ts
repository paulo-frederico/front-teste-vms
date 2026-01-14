/**
 * Serviço de autenticação mock
 * Valida credenciais de Admin Master, Cliente Master, Gerente e Visualizador
 */

import { type User } from '@/modules/shared/types/auth'
import { createMockAdminMaster } from './createMockAdminMaster'
import { validateClientMasterCredentials } from '@/fixtures/client-master-users.fixture'
import { validateManagerViewerCredentials } from '@/fixtures/manager-viewer-users.fixture'
import { validateTechnicianCredentials, TECHNICIAN_CREDENTIALS } from '@/fixtures/technician-users.fixture'

/**
 * Credenciais do Admin Master para teste
 */
const ADMIN_MASTER_CREDENTIALS = {
  email: 'admin.master@unifique.com',
  password: 'admin123',
}

/**
 * Valida as credenciais e retorna o usuário correspondente
 */
export function authenticateUser(email: string, password: string): User | null {
  // Primeiro, tenta autenticar como Admin Master
  if (
    email.toLowerCase() === ADMIN_MASTER_CREDENTIALS.email.toLowerCase() &&
    password === ADMIN_MASTER_CREDENTIALS.password
  ) {
    return createMockAdminMaster(email)
  }

  // Tenta autenticar como Cliente Master
  const clientMasterUser = validateClientMasterCredentials(email, password)
  if (clientMasterUser) {
    return clientMasterUser
  }

  // Tenta autenticar como Gerente ou Visualizador
  const managerViewerUser = validateManagerViewerCredentials(email, password)
  if (managerViewerUser) {
    return managerViewerUser
  }

  // Tenta autenticar como Técnico
  const technicianUser = validateTechnicianCredentials(email, password)
  if (technicianUser) {
    return technicianUser
  }

  // Credenciais inválidas
  return null
}

/**
 * Lista de credenciais disponíveis para demonstração
 */
export const DEMO_CREDENTIALS = {
  adminMaster: ADMIN_MASTER_CREDENTIALS,
  clientMasters: [
    { email: 'cliente@unifique.com.br', password: 'unifique123', tenant: 'Unifique Headquarters' },
    { email: 'cliente@retailpark.com', password: 'retail123', tenant: 'Retail Park Brasil' },
    { email: 'cliente@vidaplena.org', password: 'hospital123', tenant: 'Hospital Vida Plena' },
    { email: 'cliente@horizonte.edu', password: 'colegio123', tenant: 'Colégio Horizonte' },
    { email: 'cliente@inovaagro.com', password: 'inova123', tenant: 'Inova Agro Logística' },
    { email: 'cliente@vilaolimpica.com', password: 'vila123', tenant: 'Vila Olímpica Residencial' },
    { email: 'cliente@novaferrovia.com.br', password: 'ferrovia123', tenant: 'Nova Ferrovia Paulista' },
  ],
  managers: [
    { email: 'gerente1@unifique.com.br', password: 'gerente123', tenant: 'Unifique Headquarters' },
    { email: 'gerente1@retailpark.com', password: 'gerente123', tenant: 'Retail Park Brasil' },
    { email: 'gerente@vidaplena.org', password: 'gerente123', tenant: 'Hospital Vida Plena' },
    { email: 'gerente@horizonte.edu', password: 'gerente123', tenant: 'Colégio Horizonte' },
    { email: 'gerente@inovaagro.com', password: 'gerente123', tenant: 'Inova Agro Logística' },
    { email: 'gerente@vilaolimpica.com', password: 'gerente123', tenant: 'Vila Olímpica Residencial' },
    { email: 'gerente@novaferrovia.com.br', password: 'gerente123', tenant: 'Nova Ferrovia Paulista' },
  ],
  viewers: [
    { email: 'operador1@unifique.com.br', password: 'operador123', tenant: 'Unifique Headquarters' },
    { email: 'seguranca1@retailpark.com', password: 'operador123', tenant: 'Retail Park Brasil' },
    { email: 'portaria@vidaplena.org', password: 'operador123', tenant: 'Hospital Vida Plena' },
    { email: 'porteiro@horizonte.edu', password: 'operador123', tenant: 'Colégio Horizonte' },
    { email: 'vigilante1@inovaagro.com', password: 'operador123', tenant: 'Inova Agro Logística' },
    { email: 'portaria@vilaolimpica.com', password: 'operador123', tenant: 'Vila Olímpica Residencial' },
    { email: 'operador@novaferrovia.com.br', password: 'operador123', tenant: 'Nova Ferrovia Paulista' },
  ],
  technicians: TECHNICIAN_CREDENTIALS,
}
