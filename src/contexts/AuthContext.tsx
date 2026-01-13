import React, { useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { authenticateUser } from '@/lib/auth/mockAuthService'
import { getRedirectPathByRole } from '@/lib/auth/getRedirectPathByRole'

import { type User } from '@/modules/shared/types/auth'
import type { AuthContextType } from './auth.types'
import { AuthContext } from './auth.context'

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
            console.error('Usuário com estrutura inválida')
            clearAuthData()
            return
          }

          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      // Autentica usando o serviço mock que valida Admin Master e Cliente Master
      const authenticatedUser = authenticateUser(email, password)

      if (!authenticatedUser) {
        throw new Error('Credenciais inválidas')
      }

      const mockToken = `mock_access_token_${Date.now()}`
      const mockRefreshToken = `mock_refresh_token_${Date.now()}`

      localStorage.setItem('vms_user', JSON.stringify(authenticatedUser))
      localStorage.setItem('vms_access_token', mockToken)
      localStorage.setItem('vms_refresh_token', mockRefreshToken)

      setUser(authenticatedUser)

      // Redireciona para o dashboard apropriado baseado no role
      const redirectPath = getRedirectPathByRole(authenticatedUser.role)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      console.log('Fazendo logout completo...')
      clearAuthData()
      setUser(null)
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Erro no logout:', error)
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
