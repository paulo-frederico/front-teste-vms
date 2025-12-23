import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts'

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
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="off" />
              <p className="text-xs text-muted-foreground">
                Para testes, use um e-mail válido. Os dados ficam apenas no seu navegador.
              </p>
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
