import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  type AccessLevel,
  type AccessPermission,
  AVAILABLE_PERMISSIONS,
  DEFAULT_ACCESS_LEVELS
} from '../mockAccessLevels'

type AccessLevelFormProps = {
  level?: AccessLevel
  onSave: (level: AccessLevel) => void
  onCancel: () => void
}

export function AccessLevelForm({ level, onSave, onCancel }: AccessLevelFormProps) {
  const isEditing = !!level
  const isSystemLevel = !level?.isCustom

  const [formData, setFormData] = useState<Partial<AccessLevel>>(
    level || {
      name: '',
      description: '',
      enabled: true,
      isCustom: true,
      baseLevel: 'level-viewer',
      permissions: [],
      inheritedPermissions: []
    }
  )

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(level?.permissions.map((p) => p.id) || [])
  )

  // Calcular permissões herdadas baseado no nível base selecionado
  const baseLevel =
    formData.baseLevel &&
    DEFAULT_ACCESS_LEVELS.find((l) => l.id === formData.baseLevel)

  const inheritedPermissions = baseLevel ? baseLevel.permissions : []
  const inheritedPermissionIds = new Set(
    inheritedPermissions.map((p: AccessPermission) => p.id)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      alert('Nome do nível é obrigatório')
      return
    }

    if (selectedPermissions.size === 0) {
      alert('Selecione pelo menos uma permissão')
      return
    }

    // Buscar objetos de permissão selecionadas
    const selectedPermissionObjects: AccessPermission[] = []
    const allPermissions = Object.values(AVAILABLE_PERMISSIONS).flat()

    selectedPermissions.forEach((permId) => {
      const perm = allPermissions.find((p) => p.id === permId)
      if (perm) {
        selectedPermissionObjects.push(perm)
      }
    })

    const newLevel: AccessLevel = {
      id: level?.id || `level-custom-${Date.now()}`,
      name: formData.name,
      description: formData.description || '',
      enabled: formData.enabled ?? true,
      isCustom: formData.isCustom ?? true,
      baseLevel: formData.baseLevel,
      permissions: selectedPermissionObjects,
      inheritedPermissions: Array.from(inheritedPermissions),
      createdAt: level?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: level?.createdBy || 'current-user@unifique.com'
    }

    onSave(newLevel)
  }

  const togglePermission = (permId: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permId)) {
      newSelected.delete(permId)
    } else {
      newSelected.add(permId)
    }
    setSelectedPermissions(newSelected)
  }

  const handleSelectBaseLevel = (baseId: string) => {
    setFormData((prev) => ({
      ...prev,
      baseLevel: baseId
    }))
  }

  const renderPermissionCategory = (
    category: keyof typeof AVAILABLE_PERMISSIONS,
    label: string
  ) => {
    const perms = AVAILABLE_PERMISSIONS[category]

    return (
      <div key={category} className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
        <div className="grid grid-cols-1 gap-3 pl-4">
          {perms.map((perm) => {
            const isInherited = inheritedPermissionIds.has(perm.id)
            const isSelected = selectedPermissions.has(perm.id)

            return (
              <div
                key={perm.id}
                className={`flex items-start gap-3 p-2 rounded-md ${
                  isInherited ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <Checkbox
                  id={perm.id}
                  checked={isSelected}
                  onCheckedChange={() => togglePermission(perm.id)}
                  disabled={isInherited && isSystemLevel}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={perm.id}
                    className="text-sm font-medium text-slate-900 cursor-pointer block"
                  >
                    {perm.name}
                    {isInherited && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">
                        (Herdada)
                      </span>
                    )}
                  </label>
                  <p className="text-xs text-slate-500 mt-1">{perm.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="inheritance">Herança</TabsTrigger>
        </TabsList>

        {/* Tab: Geral */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome do Nível
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Gerenciador de Câmeras"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={isSystemLevel}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Descrição
                </Label>
                <Input
                  id="description"
                  placeholder="Descrição do nível de acesso"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  disabled={isSystemLevel}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                <Checkbox
                  id="enabled"
                  checked={formData.enabled ?? true}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      enabled: !!checked
                    }))
                  }
                  disabled={isSystemLevel}
                />
                <Label
                  htmlFor="enabled"
                  className="text-sm font-medium cursor-pointer"
                >
                  Nível de acesso ativo
                </Label>
              </div>

              {!isSystemLevel && formData.isCustom && (
                <div>
                  <Label htmlFor="baseLevel" className="text-sm font-medium">
                    Nível Base (opcional)
                  </Label>
                  <Select
                    value={formData.baseLevel || ''}
                    onValueChange={handleSelectBaseLevel}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione um nível base" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="level-viewer">Visualizador</SelectItem>
                      <SelectItem value="level-tech">Técnico</SelectItem>
                      <SelectItem value="level-admin">Admin Master</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-2">
                    Este nível herdará todas as permissões do nível base selecionado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Permissões */}
        <TabsContent value="permissions" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Selecione as Permissões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
                <strong>Dica:</strong> Permissões marcadas com (Herdada) vêm do nível
                base
              </div>

              {renderPermissionCategory('cameras', '📷 Câmeras')}
              {renderPermissionCategory('users', '👥 Usuários')}
              {renderPermissionCategory('infrastructure', '🔧 Infraestrutura')}
              {renderPermissionCategory('analytics', '📊 Análises')}
              {renderPermissionCategory('system', '⚙️ Sistema')}

              <div className="border-t pt-4">
                <p className="text-xs text-slate-500">
                  Total: <strong>{selectedPermissions.size}</strong> permissões
                  selecionadas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Herança */}
        <TabsContent value="inheritance" className="space-y-4 mt-6">
          <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hierarquia de Permissões</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {formData.baseLevel && baseLevel ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-slate-900 mb-2">
                      Nível Base: <strong>{baseLevel.name}</strong>
                    </p>
                    <p className="text-xs text-slate-600 mb-3">
                      {baseLevel.description}
                    </p>

                    <details className="cursor-pointer">
                      <summary className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800">
                        <ChevronDown className="h-4 w-4" />
                        Ver {baseLevel.permissions.length} permissões herdadas
                      </summary>
                      <div className="mt-3 space-y-2 ml-6">
                        {baseLevel.permissions.map((perm) => (
                          <div
                            key={perm.id}
                            className="text-xs text-slate-600 p-2 bg-white rounded border border-blue-100"
                          >
                            <strong>{perm.name}</strong>
                            <p className="text-slate-500">{perm.description}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="text-sm font-medium text-slate-900 mb-3">
                      Permissões Adicionais
                    </p>
                    <p className="text-xs text-slate-600 mb-3">
                      Permissões específicas deste nível (além das herdadas):
                    </p>

                    {selectedPermissions.size > inheritedPermissionIds.size ? (
                      <div className="space-y-2">
                        {Array.from(selectedPermissions).map((permId) => {
                          if (inheritedPermissionIds.has(permId)) return null

                          const allPerms = Object.values(AVAILABLE_PERMISSIONS).flat()
                          const perm = allPerms.find((p) => p.id === permId)

                          return (
                            <div
                              key={permId}
                              className="text-xs text-slate-600 p-2 bg-white rounded border border-slate-200"
                            >
                              <strong>{perm?.name}</strong>
                              <p className="text-slate-500">{perm?.description}</p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Nenhuma permissão adicional além do nível base
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">
                    Selecione um nível base na aba "Geral" para visualizar a
                    hierarquia
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isSystemLevel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSystemLevel}
        >
          {isEditing ? 'Salvar Alterações' : 'Criar Nível'}
        </Button>
      </div>
    </form>
  )
}
