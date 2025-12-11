/**
 * ⚠️ FIXTURES - APENAS DESENVOLVIMENTO
 * Este arquivo NÃO deve ser importado em produção
 */

if (import.meta.env.PROD) {
  throw new Error('❌ Fixtures não devem ser importados em produção!')
}

// Re-exportar todos os fixtures
export { mockTenants } from './tenants.fixture'
export { mockUsers } from './users.fixture'
export { mockCameras } from './cameras.fixture'
export { mockLocations } from './locations.fixture'
export { mockAdminUsers } from './admin-users.fixture'
export { mockAuditEvents } from './audit.fixture'
export { mockAiEvents } from './ai.fixture'
export { mockAlerts } from './alerts.fixture'
export {
  mockDashboardMetrics,
  mockClientesPorPlano,
  mockEventosIA,
  mockTopClientes,
  mockAlertasCriticos,
  mockServidoresIA,
} from './dashboard.fixture'
export { mockServers } from './servers.fixture'
