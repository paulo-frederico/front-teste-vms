import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { ChevronDown, Shield, Building2, Users, Eye, Wrench } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts'
import { DEMO_CREDENTIALS } from '@/lib/auth/mockAuthService'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('admin.master@unifique.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)

  const redirectPath = (location.state as { from?: Location } | undefined)?.from?.pathname ?? '/admin/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    try {
      await login(email.trim(), password)
    } catch (err) {
      console.error(err)
      setError('Não foi possível autenticar. Verifique suas credenciais e tente novamente.')
    }
  }

  const handleSelectCredential = (selectedEmail: string, selectedPassword: string) => {
    setEmail(selectedEmail)
    setPassword(selectedPassword)
    setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-pale px-4 py-8">
      <Card className="w-full max-w-lg border border-primary/5 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">VMS Unifique</p>
          <CardTitle className="text-2xl text-brand-deep">Entre com suas credenciais</CardTitle>
          <CardDescription>Use o e-mail corporativo e a senha temporária para acessar o ambiente seguro.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Seletor de credenciais para demo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Acesso rápido (demo)</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Selecionar usuário de teste
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] max-h-[400px] overflow-y-auto">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Administrador Master
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      handleSelectCredential(
                        DEMO_CREDENTIALS.adminMaster.email,
                        DEMO_CREDENTIALS.adminMaster.password
                      )
                    }
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">Admin Master Unifique</span>
                      <span className="text-xs text-muted-foreground">
                        {DEMO_CREDENTIALS.adminMaster.email}
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    Clientes Master (por Tenant)
                  </DropdownMenuLabel>
                  {DEMO_CREDENTIALS.clientMasters.map((cred) => (
                    <DropdownMenuItem
                      key={cred.email}
                      onClick={() => handleSelectCredential(cred.email, cred.password)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{cred.tenant}</span>
                        <span className="text-xs text-muted-foreground">{cred.email}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    Gerentes (por Tenant)
                  </DropdownMenuLabel>
                  {DEMO_CREDENTIALS.managers.map((cred) => (
                    <DropdownMenuItem
                      key={cred.email}
                      onClick={() => handleSelectCredential(cred.email, cred.password)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{cred.tenant}</span>
                        <span className="text-xs text-muted-foreground">{cred.email}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-orange-500" />
                    Visualizadores (por Tenant)
                  </DropdownMenuLabel>
                  {DEMO_CREDENTIALS.viewers.map((cred) => (
                    <DropdownMenuItem
                      key={cred.email}
                      onClick={() => handleSelectCredential(cred.email, cred.password)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{cred.tenant}</span>
                        <span className="text-xs text-muted-foreground">{cred.email}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-purple-500" />
                    Técnicos
                  </DropdownMenuLabel>
                  {DEMO_CREDENTIALS.technicians.map((cred) => (
                    <DropdownMenuItem
                      key={cred.email}
                      onClick={() => handleSelectCredential(cred.email, cred.password)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{cred.name}</span>
                        <span className="text-xs text-muted-foreground">{cred.email}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="off" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="off" />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Validando...' : 'Entrar'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Ao sair, todas as informações sensíveis são limpas automaticamente.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
