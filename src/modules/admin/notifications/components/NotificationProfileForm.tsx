import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { NotificationProfile, NotificationChannel, NotificationSeverity } from '../mockNotifications'

type NotificationProfileFormProps = {
  profile?: NotificationProfile
  onSave: (profile: NotificationProfile) => void
  onCancel: () => void
}

const CHANNELS: { value: NotificationChannel; label: string; icon: string }[] = [
  { value: 'push', label: 'Notificação Push', icon: '📱' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '📲' },
  { value: 'webhook', label: 'Webhook', icon: '🔗' }
]

const SEVERITIES: { value: NotificationSeverity; label: string; color: string }[] = [
  { value: 'critical', label: 'Crítico', color: 'text-red-600' },
  { value: 'high', label: 'Alto', color: 'text-orange-600' },
  { value: 'medium', label: 'Médio', color: 'text-yellow-600' },
  { value: 'low', label: 'Baixo', color: 'text-blue-600' },
  { value: 'info', label: 'Info', color: 'text-gray-600' }
]

export function NotificationProfileForm({
  profile,
  onSave,
  onCancel
}: NotificationProfileFormProps) {
  const isEditing = !!profile

  const [formData, setFormData] = useState<Partial<NotificationProfile>>(
    profile || {
      name: '',
      description: '',
      enabled: true,
      channels: ['email'],
      settings: {
        email: {
          enabled: true,
          format: 'html',
          includeAttachments: false
        },
        push: {
          enabled: false,
          sound: true,
          vibration: true
        },
        sms: {
          enabled: false,
          maxPerDay: 10
        },
        webhook: {
          enabled: false,
          retryAttempts: 3
        }
      },
      severityRules: {},
      recipients: [],
      schedules: []
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      alert('Nome do perfil é obrigatório')
      return
    }

    if (!formData.channels || formData.channels.length === 0) {
      alert('Selecione pelo menos um canal de notificação')
      return
    }

    const newProfile: NotificationProfile = {
      id: profile?.id || `profile-${Date.now()}`,
      name: formData.name,
      description: formData.description || '',
      enabled: formData.enabled ?? true,
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      channels: formData.channels,
      settings: formData.settings || {},
      severityRules: formData.severityRules || {},
      recipients: formData.recipients || [],
      schedules: formData.schedules || []
    }

    onSave(newProfile)
  }

  const handleChannelToggle = (channel: NotificationChannel) => {
    const newChannels = formData.channels || []
    if (newChannels.includes(channel)) {
      setFormData({
        ...formData,
        channels: newChannels.filter((c) => c !== channel)
      })
    } else {
      setFormData({
        ...formData,
        channels: [...newChannels, channel]
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {isEditing ? 'Editar Perfil de Notificação' : 'Novo Perfil de Notificação'}
        </h3>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="severity">Severidade</TabsTrigger>
          <TabsTrigger value="recipients">Destinatários</TabsTrigger>
        </TabsList>

        {/* Tab: Geral */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Nome do Perfil *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Alertas Críticos - 24/7"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-xs">Descrição</Label>
                <Input
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o propósito deste perfil"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="enabled"
                  checked={formData.enabled ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: !!checked })}
                />
                <Label htmlFor="enabled" className="text-sm cursor-pointer">
                  Perfil ativo
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Canais */}
        <TabsContent value="channels" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Canais de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {CHANNELS.map((channel) => (
                  <div
                    key={channel.value}
                    className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Checkbox
                      id={channel.value}
                      checked={(formData.channels || []).includes(channel.value)}
                      onCheckedChange={() => handleChannelToggle(channel.value)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={channel.value}
                        className="text-sm font-medium text-slate-900 cursor-pointer"
                      >
                        {channel.icon} {channel.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Configurações específicas por canal */}
              {(formData.channels || []).includes('email') && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Configurações de Email</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Formato</Label>
                      <Select
                        value={formData.settings?.email?.format || 'html'}
                        onValueChange={(value: 'html' | 'text') =>
                          setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings,
                              email: {
                                enabled: formData.settings?.email?.enabled ?? true,
                                format: value as 'html' | 'text',
                                includeAttachments: formData.settings?.email?.includeAttachments ?? false
                              }
                            }
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="text">Texto Plano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="attachments"
                        checked={formData.settings?.email?.includeAttachments ?? false}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings,
                              email: {
                                enabled: formData.settings?.email?.enabled ?? true,
                                format: formData.settings?.email?.format ?? 'html',
                                includeAttachments: !!checked
                              }
                            }
                          })
                        }
                      />
                      <Label htmlFor="attachments" className="text-sm cursor-pointer">
                        Incluir anexos
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Severidade */}
        <TabsContent value="severity" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Regras por Severidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SEVERITIES.map((severity) => (
                <div key={severity.value} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`text-sm font-semibold ${severity.color}`}>●</div>
                    <h4 className="font-semibold text-slate-900">{severity.label}</h4>
                  </div>
                  <div className="text-xs text-slate-600 space-y-2">
                    <p>Canais para este nível serão configuráveis</p>
                    <p>Escalonamento automático disponível</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Destinatários */}
        <TabsContent value="recipients" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Destinatários</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Configure os destinatários das notificações e suas prioridades
              </p>
              <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 text-center">
                Gerenciamento de destinatários será implementado em breve
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
