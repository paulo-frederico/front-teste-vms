import { Lock, Edit2, Trash2, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { type AccessLevel } from '../mockAccessLevels'

type AccessLevelCardProps = {
  level: AccessLevel
  onEdit: (level: AccessLevel) => void
  onDelete: (level: AccessLevel) => void
}

export function AccessLevelCard({
  level,
  onEdit,
  onDelete
}: AccessLevelCardProps) {
  const categoryColors: Record<string, string> = {
    cameras: 'bg-purple-100 text-purple-700',
    users: 'bg-blue-100 text-blue-700',
    infrastructure: 'bg-orange-100 text-orange-700',
    analytics: 'bg-green-100 text-green-700',
    system: 'bg-red-100 text-red-700'
  }

  // Agrupar permissões por categoria
  const permissionsByCategory = level.permissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = []
      }
      acc[perm.category].push(perm)
      return acc
    },
    {} as Record<string, typeof level.permissions>
  )

  const isSystemLevel = !level.isCustom

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100 hover:ring-slate-200 transition-all">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">{level.name}</h3>
              {!level.enabled && (
                <Badge variant="outline" className="text-xs">
                  Inativo
                </Badge>
              )}
              {level.isCustom && (
                <Badge className="text-xs bg-blue-600">Customizado</Badge>
              )}
              {isSystemLevel && (
                <Badge className="text-xs bg-slate-600">Padrão</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">{level.description}</p>
          </div>

          {!isSystemLevel && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(level)}
                className="text-slate-500 hover:text-slate-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(level)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Permissões por categoria */}
        <div className="space-y-3 pt-3 border-t">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ${
                    categoryColors[category] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category === 'cameras'
                    ? '📷'
                    : category === 'users'
                      ? '👥'
                      : category === 'infrastructure'
                        ? '🔧'
                        : category === 'analytics'
                          ? '📊'
                          : '⚙️'}{' '}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="text-xs text-slate-500">
                  {perms.length} permissão{perms.length !== 1 ? 'ões' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 ml-2">
                {perms.map((perm) => (
                  <span
                    key={perm.id}
                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                  >
                    {perm.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Informações adicionais */}
        <div className="flex items-center justify-between pt-3 border-t text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" />
            {level.permissions.length} permissões
          </div>
          {level.baseLevel && (
            <div className="text-blue-600">
              Baseado em nível existente
            </div>
          )}
          <time>
            Atualizado{' '}
            {new Date(level.updatedAt).toLocaleDateString('pt-BR')}
          </time>
        </div>
      </CardContent>
    </Card>
  )
}
