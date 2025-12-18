import { useState } from 'react'
import { toast } from 'react-toastify'
import { Upload, Sun, Moon, Monitor, Check, X, RefreshCw, Server, Cloud, Ticket, Bell, Mail, HardDrive, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageIntro } from '@/modules/shared/components/PageIntro'

const INTEGRATIONS = [
  { id: 'noc', name: 'API NOC', icon: Server, status: 'connected', lastSync: '2 min atrás' },
  { id: 'tickets', name: 'Plataforma de Tickets', icon: Ticket, status: 'connected', lastSync: '5 min atrás' },
  { id: 'storage', name: 'Storage Cloud (S3)', icon: Cloud, status: 'connected', lastSync: '1 min atrás' },
  { id: 'email', name: 'SMTP / Email', icon: Mail, status: 'disconnected', lastSync: 'Nunca' },
  { id: 'push', name: 'Push Notifications', icon: Bell, status: 'error', lastSync: 'Erro de conexão' },
]

export function AdminSettingsPage() {
  const [productName, setProductName] = useState('VMS Unifique')
  const [portalUrl, setPortalUrl] = useState('https://portal.unifique.com.br')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')
  const [retentionDays, setRetentionDays] = useState('30')
  const [maxStreamQuality, setMaxStreamQuality] = useState('1080p')
  const [enableAuditLogs, setEnableAuditLogs] = useState(true)
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Configurações salvas com sucesso!')
    setIsSaving(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100'
      case 'disconnected': return 'text-gray-600 bg-gray-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="w-3 h-3" />
      case 'disconnected': return <X className="w-3 h-3" />
      case 'error': return <X className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <section className="space-y-6">
      <PageIntro
        title="Configurações do sistema"
        description="Centralize parâmetros globais, integrações e preferências de branding para tenants."
        actions={
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Marca e Identidade */}
        <Card>
          <CardHeader>
            <CardTitle>Marca e identidade</CardTitle>
            <CardDescription>Controle os elementos compartilhados entre tenants e squads.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do produto</Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>URL do portal</Label>
              <Input
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {/* Upload de Logo */}
            <div>
              <Label>Logotipo</Label>
              <div className="mt-1.5 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400 text-center px-2">Logo atual</span>
                </div>
                <div className="flex-1">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Fazer upload
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">PNG, SVG até 2MB. Recomendado 200x50px</p>
                </div>
              </div>
            </div>

            {/* Tema */}
            <div>
              <Label>Tema da interface</Label>
              <div className="mt-2 flex gap-2">
                {[
                  { value: 'light', icon: Sun, label: 'Claro' },
                  { value: 'dark', icon: Moon, label: 'Escuro' },
                  { value: 'system', icon: Monitor, label: 'Sistema' },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value as 'light' | 'dark' | 'system')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      theme === value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parâmetros Globais */}
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros globais</CardTitle>
            <CardDescription>Valores padrão aplicados a novos tenants.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Retenção padrão</Label>
                <Select value={retentionDays} onValueChange={setRetentionDays}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Qualidade máxima</Label>
                <Select value={maxStreamQuality} onValueChange={setMaxStreamQuality}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (SD)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Logs de auditoria</p>
                  <p className="text-xs text-gray-500">Registrar todas as ações no sistema</p>
                </div>
                <Switch checked={enableAuditLogs} onCheckedChange={setEnableAuditLogs} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Alertas por email</p>
                  <p className="text-xs text-gray-500">Enviar notificações críticas por email</p>
                </div>
                <Switch checked={enableEmailAlerts} onCheckedChange={setEnableEmailAlerts} />
              </div>
            </div>

            {/* Info Storage */}
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium">Storage Global</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Usado:</span>{' '}
                  <span className="font-medium">2.4 TB</span>
                </div>
                <div>
                  <span className="text-slate-500">Disponível:</span>{' '}
                  <span className="font-medium">7.6 TB</span>
                </div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-blue-500 w-[24%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrações */}
      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>Conexões com APIs externas e serviços.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((integration) => (
              <div key={integration.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <integration.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{integration.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        {integration.status === 'connected' ? 'Conectado' : integration.status === 'error' ? 'Erro' : 'Desconectado'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{integration.lastSync}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
