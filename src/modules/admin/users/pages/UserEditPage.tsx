import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts'
import { useUser, useUpdateUser } from '@/hooks/useUsers'
import { useTenants } from '@/hooks/useTenants'
import { UserForm } from '../UserForm'
import type { User } from '../userTypes'
import type { UpdateUserDTO } from '@/services/api/users.service'
import { ScopeType, UserStatus, type UserPermissions } from '@/modules/shared/types/auth'

// Default permissions for users
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

export function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { data: userData, isLoading } = useUser(id!)
  const updateUser = useUpdateUser()
  const { data: tenantsData } = useTenants()

  const availableTenants = tenantsData?.tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
  })) || []

  const handleSubmit = async (data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    if (!id) return
    // Transform UserForm data to UpdateUserDTO format
    const updateData: UpdateUserDTO = {
      name: data.name,
      email: data.email,
      role: data.role,
      tenantId: data.tenantId,
      scope: {
        type: ScopeType.GLOBAL,
        tenantId: data.tenantId,
      },
      permissions: getDefaultPermissions(),
      phone: data.phone,
      status: data.status === 'ACTIVE' ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    }
    await updateUser.mutateAsync({ id, data: updateData })
    navigate('/admin/users')
  }

  const handleCancel = () => {
    navigate('/admin/users')
  }

  if (!currentUser) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-slate-500">Carregando usuário...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-slate-500">Usuário não encontrado</p>
      </div>
    )
  }

  // Map userData to User type for the form
  const initialData: User = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    role: userData.role,
    status: userData.status as User['status'],
    tenantId: userData.tenantId,
    tenantName: userData.tenantName,
    createdAt: userData.createdAt,
    lastLoginAt: userData.lastLogin,
    permissions: {
      canViewLive: userData.permissions?.canViewLive ?? true,
      canViewRecordings: userData.permissions?.canViewRecordings ?? true,
      canExportVideos: userData.permissions?.canExportVideos ?? false,
      canManageCameras: userData.permissions?.canManageCameras ?? false,
      canManageIA: userData.permissions?.canConfigureAI ?? false,
      canManageUsers: userData.permissions?.canManageUsers ?? false,
    },
    scope: userData.scope ? {
      sitesIds: userData.scope.siteIds,
      camerasIds: userData.scope.cameraIds,
    } : undefined,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar usuário</h1>
          <p className="mt-1 text-sm text-slate-500">Editando: {userData.name}</p>
        </div>
        <Button variant="outline" onClick={handleCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="mx-auto max-w-4xl">
        <UserForm
          mode="edit"
          initialData={initialData}
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
