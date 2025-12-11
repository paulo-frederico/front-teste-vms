import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'
import type { User, UserPermission, UserStatus } from '@/modules/admin/users/userTypes'

export type UserFormMode = 'create' | 'edit'

export type UserFormProps = {
  mode: UserFormMode
  initialData?: User
  availableTenants: { id: string; name: string }[]
  currentUserRole: UserRole
  currentUserTenantId?: string
  onSubmit: (data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>) => Promise<void> | void
  onCancel: () => void
}

const statusOptions: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'INVITED']

const defaultPermissions: Record<UserRole, UserPermission> = {
  [UserRole.ADMIN_MASTER]: {
    canViewLive: true,
    canViewRecordings: true,
    canExportVideos: true,
    canManageCameras: true,
    canManageIA: true,
    canManageUsers: true,
  },
  [UserRole.ADMIN]: {
    canViewLive: true,
    canViewRecordings: true,
    canExportVideos: true,
    canManageCameras: true,
    canManageIA: true,
    canManageUsers: true,
  },
  [UserRole.TECHNICIAN]: {
    canViewLive: true,
    canViewRecordings: true,
    canExportVideos: false,
    canManageCameras: true,
    canManageIA: false,
    canManageUsers: false,
  },
  [UserRole.CLIENT_MASTER]: {
    canViewLive: true,
    canViewRecordings: true,
    canExportVideos: true,
    canManageCameras: true,
    canManageIA: true,
    canManageUsers: true,
  },
  [UserRole.MANAGER]: {
    canViewLive: true,
    canViewRecordings: true,
    canExportVideos: true,
    canManageCameras: true,
    canManageIA: false,
    canManageUsers: false,
  },
  [UserRole.VIEWER]: {
    canViewLive: true,
    canViewRecordings: true,
    canExportVideos: false,
    canManageCameras: false,
    canManageIA: false,
    canManageUsers: false,
  },
}

function getDefaultPermissions(role: UserRole) {
  return { ...defaultPermissions[role] }
}

const baseFormData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'> = {
  name: '',
  email: '',
  phone: '',
  role: UserRole.VIEWER,
  status: 'ACTIVE',
  tenantId: undefined,
  tenantName: undefined,
  permissions: getDefaultPermissions(UserRole.VIEWER),
  scope: undefined,
}

function mapUserToFormData(user?: User) {
  if (!user) {
    return {
      ...baseFormData,
      permissions: getDefaultPermissions(baseFormData.role),
    }
  }

  const { id: _id, createdAt: _createdAt, lastLoginAt: _lastLoginAt, ...rest } = user
  void _id
  void _createdAt
  void _lastLoginAt
  return {
    ...baseFormData,
    ...rest,
    permissions: { ...rest.permissions },
  }
}

export function UserForm({
  mode,
  initialData,
  availableTenants,
  currentUserRole,
  currentUserTenantId,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [formData, setFormData] = useState(() => mapUserToFormData(initialData))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setFormData(mapUserToFormData(initialData))
    setErrors({})
  }, [initialData])

  useEffect(() => {
    const isCentralAdmin = currentUserRole === UserRole.ADMIN_MASTER || currentUserRole === UserRole.ADMIN
    if (!isCentralAdmin && currentUserTenantId) {
      const tenantName = availableTenants.find((tenant) => tenant.id === currentUserTenantId)?.name
      setFormData((prev) => ({
        ...prev,
        tenantId: currentUserTenantId,
        tenantName,
      }))
    }
  }, [currentUserRole, currentUserTenantId, availableTenants])

  const title = mode === 'edit' ? 'Editar usuário' : 'Novo usuário'

  const allowedRoles = useMemo(() => {
    if (currentUserRole === UserRole.ADMIN_MASTER) {
      return [
        UserRole.ADMIN_MASTER,
        UserRole.ADMIN,
        UserRole.TECHNICIAN,
        UserRole.CLIENT_MASTER,
        UserRole.MANAGER,
        UserRole.VIEWER,
      ]
    }
    if (currentUserRole === UserRole.ADMIN) {
      return [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.CLIENT_MASTER, UserRole.MANAGER, UserRole.VIEWER]
    }
    if (currentUserRole === UserRole.CLIENT_MASTER) {
      return [UserRole.CLIENT_MASTER, UserRole.MANAGER, UserRole.VIEWER]
    }
    if (currentUserRole === UserRole.MANAGER) {
      return [UserRole.MANAGER, UserRole.VIEWER]
    }
    return [UserRole.VIEWER]
  }, [currentUserRole])

  const availableTenantOptions = useMemo(() => {
    const isCentralAdmin = currentUserRole === UserRole.ADMIN_MASTER || currentUserRole === UserRole.ADMIN
    if (isCentralAdmin) {
      return availableTenants
    }
    if (currentUserTenantId) {
      return availableTenants.filter((tenant) => tenant.id === currentUserTenantId)
    }
    return []
  }, [availableTenants, currentUserRole, currentUserTenantId])

  const handleInputChange = (field: keyof typeof formData, value: string | UserRole | UserStatus | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePermissionsChange = (field: keyof UserPermission, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: value,
      },
    }))
  }

  const handleRoleChange = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: mode === 'create' && !initialData ? getDefaultPermissions(role) : prev.permissions,
    }))
  }

  const handleTenantChange = (tenantId?: string) => {
    const tenantName = availableTenantOptions.find((tenant) => tenant.id === tenantId)?.name
    setFormData((prev) => ({
      ...prev,
      tenantId,
      tenantName,
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Informe o nome completo'
    if (!formData.email.trim()) newErrors.email = 'Informe o e-mail corporativo'

    if (formData.role !== UserRole.ADMIN_MASTER && formData.role !== UserRole.ADMIN && !formData.tenantId) {
      newErrors.tenantId = 'Selecione o cliente associado'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tenantReadOnly = currentUserRole !== UserRole.ADMIN_MASTER && currentUserRole !== UserRole.ADMIN
  const permissionFields: { field: keyof UserPermission; label: string }[] = [
    { field: 'canViewLive', label: 'Pode ver câmeras ao vivo' },
    { field: 'canViewRecordings', label: 'Pode ver gravações' },
    { field: 'canExportVideos', label: 'Pode exportar vídeos' },
    { field: 'canManageCameras', label: 'Pode gerenciar câmeras' },
    { field: 'canManageIA', label: 'Pode gerenciar IA' },
    { field: 'canManageUsers', label: 'Pode gerenciar usuários' },
  ]

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {mode === 'edit' ? 'Atualize informações e permissões deste usuário.' : 'Convide ou cadastre novos perfis de acesso.'}
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border bg-white/80 p-5">
        <p className="text-sm font-semibold text-muted-foreground">Dados principais</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="user-name" className="text-sm font-medium text-foreground">
              Nome completo *
            </label>
            <Input
              id="user-name"
              value={formData.name}
              onChange={(event) => handleInputChange('name', event.target.value)}
              placeholder="Ex.: Juliano Ribeiro"
            />
            {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="user-email" className="text-sm font-medium text-foreground">
              E-mail *
            </label>
            <Input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(event) => handleInputChange('email', event.target.value)}
              placeholder="usuario@empresa.com"
            />
            {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="user-phone" className="text-sm font-medium text-foreground">
              Telefone
            </label>
            <Input
              id="user-phone"
              value={formData.phone ?? ''}
              onChange={(event) => handleInputChange('phone', event.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Status *</span>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as UserStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'ACTIVE' ? 'Ativo' : status === 'SUSPENDED' ? 'Suspenso' : 'Convite pendente'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Perfil *</span>
            <Select value={formData.role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">Cliente / Tenant *</span>
            {tenantReadOnly ? (
              <div className="rounded-xl border bg-muted/30 px-3 py-2 text-sm font-semibold text-muted-foreground">
                {availableTenantOptions[0]?.name || 'Tenant não configurado'}
              </div>
            ) : (
              <Select
                value={formData.tenantId ?? ''}
                onValueChange={(value) => handleTenantChange(value || undefined)}
                disabled={formData.role === UserRole.ADMIN_MASTER || formData.role === UserRole.ADMIN}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tenant" />
                </SelectTrigger>
                <SelectContent>
                  {availableTenantOptions.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.tenantId ? <p className="text-xs text-red-500">{errors.tenantId}</p> : null}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border bg-white/80 p-5">
        <p className="text-sm font-semibold text-muted-foreground">Permissões</p>
        <div className="grid gap-3 md:grid-cols-2">
          {permissionFields.map((permission) => (
            <label key={permission.field} className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-muted"
                checked={formData.permissions[permission.field]}
                onChange={(event) => handlePermissionsChange(permission.field, event.target.checked)}
                disabled={formData.role === UserRole.ADMIN_MASTER || formData.role === UserRole.ADMIN}
              />
              {permission.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border bg-white/80 p-5">
        <p className="text-sm font-semibold text-muted-foreground">Escopo (opcional)</p>
        <p className="text-xs text-muted-foreground">Use este campo para registrar observações sobre sites ou câmeras específicos atribuídos a este usuário.</p>
        <textarea
          className="min-h-[80px] w-full rounded-xl border border-muted bg-white px-3 py-2 text-sm"
          value={formData.scope?.sitesIds?.join(', ') ?? ''}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              scope: event.target.value
                ? {
                    ...prev.scope,
                    sitesIds: event.target.value.split(',').map((value) => value.trim()).filter(Boolean),
                  }
                : undefined,
            }))
          }
          placeholder="IDs de sites (se necessário)"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
