import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AuthProvider, useAuth } from '@/contexts'
import { SystemRole } from '@/modules/shared/types/auth'
import type { User } from '@/types/user.types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
)

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('deve inicializar sem usuário autenticado', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('deve fazer login e persistir tokens', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('admin@vms.com', 'password')
    })

    expect(result.current.user?.email).toBe('admin@vms.com')
    expect(result.current.isAuthenticated).toBe(true)
    expect(localStorage.getItem('vms_user')).not.toBeNull()
    expect(localStorage.getItem('vms_access_token')).not.toBeNull()
    expect(localStorage.getItem('vms_refresh_token')).not.toBeNull()
  })

  it('deve efetuar logout limpando todos os dados sensíveis', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('admin@vms.com', 'password')
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(localStorage.getItem('vms_user')).toBeNull()
    expect(localStorage.getItem('vms_access_token')).toBeNull()
    expect(localStorage.getItem('vms_refresh_token')).toBeNull()
    expect(sessionStorage.length).toBe(0)
  })

  it('deve carregar usuário previamente salvo no localStorage', async () => {
    const persistedUser: User = {
      id: 'persisted-1',
      name: 'Usuário Persistido',
      email: 'persistido@vms.com',
      role: SystemRole.ADMIN_MASTER,
      status: 'ACTIVE',
      tenantId: 'master',
      permissions: {
        canViewRecordings: true,
        canExportVideos: true,
        canConfigureAI: true,
        canConfigureStreamProfiles: true,
        canManageUsers: true,
        canManageCameras: true,
        canAccessDashboard: true,
        maxStreamQuality: '4K',
        allowedAIModules: ['LPR'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem('vms_user', JSON.stringify(persistedUser))
    localStorage.setItem('vms_access_token', 'token')

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.user?.email).toBe('persistido@vms.com')
    expect(result.current.isAuthenticated).toBe(true)
  })
})
