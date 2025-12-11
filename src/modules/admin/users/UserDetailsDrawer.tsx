import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserForm } from '@/modules/admin/users/UserForm'
import { getUserByIdMock, updateUserMock } from '@/modules/admin/users/userMocks'
import type { User, UserStatus } from '@/modules/admin/users/userTypes'
import { UserRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'

const statusLabelMap: Record<UserStatus, string> = {
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
  INVITED: 'Convite pendente',
}

const statusBadgeClass: Record<UserStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  SUSPENDED: 'bg-amber-100 text-amber-700 border border-amber-200',
  INVITED: 'bg-sky-100 text-sky-700 border border-sky-200',
}

const roleBadgeClass: Record<UserRole, string> = {
  [UserRole.ADMIN_MASTER]: 'bg-purple-100 text-purple-700 border border-purple-200',
  [UserRole.ADMIN]: 'bg-purple-50 text-purple-700 border border-purple-100',
  [UserRole.TECHNICIAN]: 'bg-blue-100 text-blue-700 border border-blue-200',
  [UserRole.CLIENT_MASTER]: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  [UserRole.MANAGER]: 'bg-sky-100 text-sky-700 border border-sky-200',
  [UserRole.VIEWER]: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export type UserDetailsDrawerProps = {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  availableTenants: { id: string; name: string }[]
  currentUserRole: UserRole
  currentUserTenantId?: string
  onUserUpdated?: () => void
}

export function UserDetailsDrawer({
  userId,
  open,
  onOpenChange,
  availableTenants,
  currentUserRole,
  currentUserTenantId,
  onUserUpdated,
}: UserDetailsDrawerProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)

  useEffect(() => {
    if (!open || !userId) {
      return
    }

    let isActive = true

    getUserByIdMock(userId).then((result) => {
      if (!isActive) {
        return
      }
      setUser(result ?? null)
    })

    return () => {
      isActive = false
    }
  }, [userId, open])

  const isLoading = open && Boolean(userId) && user?.id !== userId

  const drawerTitle = useMemo(() => {
    if (!user || user.id !== userId) return 'Detalhes do usuário'
    return user.name
  }, [user, userId])

  const handleStatusToggle = async () => {
    if (!user) return
    setIsStatusUpdating(true)
    const nextStatus: UserStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const updated = await updateUserMock(user.id, { status: nextStatus })
    if (updated) {
      setUser(updated)
      onUserUpdated?.()
    }
    setIsStatusUpdating(false)
  }

  const handleFormSubmit = async (data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>) => {
    if (!user) return
    const updated = await updateUserMock(user.id, data)
    if (updated) {
      setUser(updated)
      onUserUpdated?.()
    }
  }

  const formatDateTime = (value?: string) => {
    if (!value) return '—'
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDrawerChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setUser(null)
    }
    onOpenChange(nextOpen)
  }

  const canToggleStatus = user && user.role !== UserRole.ADMIN_MASTER

  return (
    <Dialog open={open} onOpenChange={handleDrawerChange}>
      <DialogContent className="max-w-5xl gap-0 p-0">
        <DialogHeader className="border-b px-6 py-4 text-left">
          <DialogTitle className="text-2xl font-semibold text-foreground">{drawerTitle}</DialogTitle>
          {user ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className={`rounded-full px-2 py-0.5 ${roleBadgeClass[user.role]}`}>{ROLE_LABELS[user.role]}</span>
              <span className={`rounded-full px-2 py-0.5 ${statusBadgeClass[user.status]}`}>{statusLabelMap[user.status]}</span>
              {user.tenantName ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{user.tenantName}</span>
              ) : null}
            </div>
          ) : null}
        </DialogHeader>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr]">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Carregando informações...
            </div>
          ) : user && user.id === userId ? (
            <>
              <div className="space-y-6">
                <section className="rounded-2xl border bg-muted/10 p-5">
                  <dl className="grid gap-3 text-sm text-foreground">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">E-mail</dt>
                      <dd className="font-medium">{user.email}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Telefone</dt>
                      <dd className="font-medium">{user.phone || '—'}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Criado em</dt>
                      <dd className="font-medium">{formatDateTime(user.createdAt)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Último acesso</dt>
                      <dd className="font-medium">{formatDateTime(user.lastLoginAt)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 grid gap-3 text-xs">
                    <p className="text-muted-foreground">Permissões</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.entries(user.permissions).map(([key, value]) => (
                        <span
                          key={key}
                          className={`rounded-full px-2 py-1 text-center text-[11px] font-semibold ${value ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}
                        >
                          {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  {canToggleStatus ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={handleStatusToggle}
                      disabled={isStatusUpdating}
                    >
                      {isStatusUpdating
                        ? 'Atualizando...'
                        : user.status === 'ACTIVE'
                          ? 'Suspender conta'
                          : 'Reativar conta'}
                    </Button>
                  ) : null}
                </section>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <UserForm
                  mode="edit"
                  initialData={user}
                  availableTenants={availableTenants}
                  currentUserRole={currentUserRole}
                  currentUserTenantId={currentUserTenantId}
                  onSubmit={handleFormSubmit}
                  onCancel={() => handleDrawerChange(false)}
                />
              </div>
            </>
          ) : (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              Nenhum usuário selecionado.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
