import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/modules/shared/components/Sidebar'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-pale text-muted-foreground">
        Carregando contexto...
      </div>
    )
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="flex min-h-screen bg-brand-pale text-foreground">
      <aside
        className={cn(
          'fixed left-0 top-0 hidden h-screen flex-shrink-0 flex-col overflow-y-auto bg-brand-deep text-white transition-[width] duration-300 lg:flex',
          isSidebarExpanded ? 'w-64' : 'w-20',
        )}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <Sidebar role={user.role} isCompact={!isSidebarExpanded} />
      </aside>

      <div className={cn(
        'flex w-full flex-col transition-all duration-300',
        isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'
      )}>
        <Header
          user={user}
          sectionTitle="Portal Operacional"
          sectionSubtitle="Administração unificada"
          notificationsCount={3}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex flex-1 flex-col gap-6 bg-muted/40 px-4 pb-8 pt-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 px-0 transition-opacity lg:hidden',
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setIsSidebarOpen(false)}
      >
        <aside
          className={cn(
            'absolute left-0 top-0 h-full w-72 flex-shrink-0 bg-brand-deep text-white shadow-2xl transition-transform',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <p className="text-lg font-semibold">Menu</p>
            <Button variant="ghost" size="sm" className="text-white" onClick={() => setIsSidebarOpen(false)}>
              Fechar
            </Button>
          </div>
          <Sidebar role={user.role} onNavigate={() => setIsSidebarOpen(false)} />
        </aside>
      </div>
    </div>
  )
}
