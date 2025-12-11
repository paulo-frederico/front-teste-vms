import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { ScopeType, SystemRole, UserStatus, type User } from '@/modules/shared/types/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('vms_user')
        const token = localStorage.getItem('vms_access_token')

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser) as User

          if (!parsedUser.role || !parsedUser.scope) {
            console.error('❌ Usuário com estrutura inválida')
            clearAuthData()
            return
          }

          setUser(parsedUser)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, _password: string): Promise<void> => {
    setIsLoading(true)
    try {
      // TODO: Substituir por chamada real à API
      const mockUser = createMockAdminMaster(email)
      const mockToken = `mock_access_token_${Date.now()}`
      const mockRefreshToken = `mock_refresh_token_${Date.now()}`

      localStorage.setItem('vms_user', JSON.stringify(mockUser))
      localStorage.setItem('vms_access_token', mockToken)
      localStorage.setItem('vms_refresh_token', mockRefreshToken)

      setUser(mockUser)
      navigate('/admin-master/dashboard', { replace: true })
    } catch (error) {
      console.error('❌ Erro no login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      console.log('🚪 Fazendo logout completo...')
      clearAuthData()
      setUser(null)
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      clearAuthData()
      setUser(null)
      navigate('/login', { replace: true })
    } finally {
      setIsLoading(false)
    }
  }

  const clearAuthData = () => {
    localStorage.removeItem('vms_user')
    localStorage.removeItem('vms_access_token')
    localStorage.removeItem('vms_refresh_token')

    const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith('vms_') || key.startsWith('tenant_'))
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    sessionStorage.clear()
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('vms_user', JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

function createMockAdminMaster(email: string): User {
  const now = new Date().toISOString()

  return {
    id: '1',
    name: 'Admin Master',
    email,
    role: SystemRole.ADMIN_MASTER,
    status: UserStatus.ACTIVE,
    scope: { type: ScopeType.GLOBAL },
    permissions: {
      canAccessDashboard: true,
      canViewLive: true,
      canViewRecordings: true,
      canViewPlayback: true,
      canExportVideos: true,
      canExportReports: true,
      canManageUsers: true,
      canManageAdmins: true,
      canManageTechnicians: true,
      canResetPasswords: true,
      canSuspendUsers: true,
      canViewAllTenants: true,
      canManageTenants: true,
      canChangeTenantPlan: true,
      canSuspendTenants: true,
      canManageCameras: true,
      canConfigureStreamProfiles: true,
      canDeleteCameras: true,
      canConfigureAI: true,
      canConfigureAIZones: true,
      canConfigureAISensitivity: true,
      canConfigureRecording: true,
      canDeleteRecordings: true,
      canConfigureAlerts: true,
      canAcknowledgeAlerts: true,
      canManageInfrastructure: true,
      canAccessGlobalAudit: true,
      canManageGlobalSettings: true,
      canForceLogout: true,
      canGrantTemporaryAccess: true,
      canAccessDiagnostics: true,
      canViewLogs: true,
      maxStreamQuality: '4K',
      allowedAIModules: ['LPR', 'INTRUSION', 'LINE_CROSSING', 'PEOPLE_COUNTING', 'VEHICLE_COUNTING', 'LOITERING', 'PPE'],
    },
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
    tenantId: undefined,
    tenantName: undefined,
    phone: undefined,
    avatar: undefined,
  }
}
