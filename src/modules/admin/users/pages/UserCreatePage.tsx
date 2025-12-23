import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts'
import { useCreateUser } from '@/hooks/useUsers'
import { useTenants } from '@/hooks/useTenants'
import { UserForm } from '../UserForm'
import type { User } from '../userTypes'
import type { CreateUserDTO } from '@/services/api/users.service'
import { ScopeType, type UserPermissions } from '@/modules/shared/types/auth'

// Default permissions for new users
const getDefaultPermissions = (): UserPermissions => ({
  canAccessDashboard: true,
  canViewLive: true,
  canViewRecordings: true,
  canViewPlayback: true,
  canExportVideos: false,
  canExportReports: false,
  canManageUsers: false,
  canManageAdmins: false,
  canManageTechnicians: false,
  canResetPasswords: false,
  canSuspendUsers: false,
  canViewAllTenants: false,
  canManageTenants: false,
  canChangeTenantPlan: false,
  canSuspendTenants: false,
  canManageCameras: false,
  canConfigureStreamProfiles: false,
  canDeleteCameras: false,
  canConfigureAI: false,
  canConfigureAIZones: false,
  canConfigureAISensitivity: false,
  canConfigureRecording: false,
  canDeleteRecordings: false,
  canConfigureAlerts: false,
  canAcknowledgeAlerts: false,
  canManageInfrastructure: false,
  canAccessGlobalAudit: false,
  canManageGlobalSettings: false,
  canForceLogout: false,
  canGrantTemporaryAccess: false,
  canAccessDiagnostics: false,
  canViewLogs: false,
  maxStreamQuality: 'HD',
  allowedAIModules: [],
})

export function UserCreatePage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const createUser = useCreateUser()
  const { data: tenantsData } = useTenants()

  const availableTenants = tenantsData?.tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
  })) || []

  const handleSubmit = async (data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    // Transform UserForm data to CreateUserDTO format
    const createData: CreateUserDTO = {
      name: data.name,
      email: data.email,
      password: crypto.randomUUID(), // Temporary password, user should reset
      role: data.role,
      tenantId: data.tenantId,
      scope: {
        type: ScopeType.GLOBAL,
        tenantId: data.tenantId,
      },
      permissions: getDefaultPermissions(),
      phone: data.phone,
    }
    await createUser.mutateAsync(createData)
    navigate('/admin/users')
  }

  const handleCancel = () => {
    navigate('/admin/users')
  }

  if (!currentUser) return null

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo usuário</h1>
          <p className="mt-1 text-sm text-slate-500">Crie um novo usuário no sistema</p>
        </div>
        <Button variant="outline" onClick={handleCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="mx-auto max-w-4xl">
        <UserForm
          mode="create"
          availableTenants={availableTenants}
          currentUserRole={currentUser.role}
          currentUserTenantId={currentUser.tenantId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
