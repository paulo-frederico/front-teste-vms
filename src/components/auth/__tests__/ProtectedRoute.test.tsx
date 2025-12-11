import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SystemRole } from '@/modules/shared/types/auth'
import { useAuth } from '@/contexts/AuthContext'

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}))

type MockAuthValue = {
  user: { id: string; role?: SystemRole | string } | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  updateUser: () => void
}

const mockedUseAuth = useAuth as unknown as Mock

function mockAuthValue(overrides: Partial<MockAuthValue> = {}) {
  mockedUseAuth.mockReturnValue({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    ...overrides,
  })
}

function renderProtectedRoute(options: { allowedRoles?: string[]; requireAuth?: boolean } = {}) {
  const { allowedRoles = [], requireAuth = true } = options

  return render(
    <MemoryRouter initialEntries={["/secure"]}>
      <Routes>
        <Route
          path="/secure"
          element={
            <ProtectedRoute allowedRoles={allowedRoles} requireAuth={requireAuth}>
              <div>Conteúdo protegido</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/viewer/live" element={<div>Viewer Live</div>} />
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renderiza spinner enquanto o contexto carrega', () => {
    mockAuthValue({ isLoading: true })
    const { container } = renderProtectedRoute()

    expect(container.querySelector('.animate-spin')).not.toBeNull()
  })

  it('redireciona para /login quando a rota exige autenticação e o usuário não está logado', async () => {
    mockAuthValue({ isAuthenticated: false, user: null })
    renderProtectedRoute()

    expect(await screen.findByText('Login Page')).toBeInTheDocument()
  })

  it('permite acesso quando o usuário possui uma role autorizada', () => {
    mockAuthValue({
      isAuthenticated: true,
      user: { id: '1', role: SystemRole.ADMIN_MASTER },
    })

    renderProtectedRoute({ allowedRoles: [SystemRole.ADMIN_MASTER] })

    expect(screen.getByText('Conteúdo protegido')).toBeInTheDocument()
  })

  it('redireciona usuários sem permissão para a rota compatível com sua role', async () => {
    mockAuthValue({
      isAuthenticated: true,
      user: { id: '2', role: SystemRole.VIEWER },
    })

    renderProtectedRoute({ allowedRoles: [SystemRole.ADMIN_MASTER] })

    expect(await screen.findByText('Viewer Live')).toBeInTheDocument()
  })

  it('limpa o armazenamento e envia o usuário para login quando não há role definida', async () => {
    localStorage.setItem('vms_access_token', 'token')

    mockAuthValue({
      isAuthenticated: true,
      user: { id: '3' },
    })

    renderProtectedRoute()

    expect(await screen.findByText('Login Page')).toBeInTheDocument()
    expect(localStorage.getItem('vms_access_token')).toBeNull()
  })
})
