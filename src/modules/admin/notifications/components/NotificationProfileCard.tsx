import { Bell, Trash2, Edit2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NotificationProfile } from '../mockNotifications'

type NotificationProfileCardProps = {
  profile: NotificationProfile
  onEdit: (profile: NotificationProfile) => void
  onDelete: (profile: NotificationProfile) => void
}

const CHANNEL_ICONS: Record<string, string> = {
  push: '📱',
  email: '📧',
  sms: '📲',
  webhook: '🔗'
}

export function NotificationProfileCard({
  profile,
  onEdit,
  onDelete
}: NotificationProfileCardProps) {
  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100 hover:ring-slate-200 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Info Principal */}
          <div className="flex items-start gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{profile.name}</h3>
                <Badge variant={profile.enabled ? 'default' : 'secondary'}>
                  {profile.enabled ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              {profile.description && (
                <p className="text-xs text-slate-600 mt-1">{profile.description}</p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(profile)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={() => onDelete(profile)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canais */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-600 mb-2">Canais configurados:</p>
          <div className="flex flex-wrap gap-2">
            {profile.channels.map((channel) => (
              <Badge key={channel} variant="outline" className="text-xs">
                {CHANNEL_ICONS[channel]} {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Destinatários */}
        {profile.recipients && profile.recipients.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-600 mb-2">
              Destinatários ({profile.recipients.length}):
            </p>
            <div className="space-y-1">
              {profile.recipients.slice(0, 2).map((recipient) => (
                <p key={recipient.id} className="text-xs text-slate-600">
                  • <span className="font-medium">{recipient.name}</span>
                </p>
              ))}
              {profile.recipients.length > 2 && (
                <p className="text-xs text-slate-500">
                  +{profile.recipients.length - 2} mais
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Criado em{' '}
            {new Date(profile.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: '2-digit'
            })}
            {' • '}Atualizado{' '}
            {new Date(profile.updatedAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
