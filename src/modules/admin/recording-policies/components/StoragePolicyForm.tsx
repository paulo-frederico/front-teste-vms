import { useState } from 'react'
import { Save, X, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import type {
  StoragePolicy,
  RecordingMode,
  RecordingQuality,
  ExportFormat,
  ExportPermission,
  StorageTier,
  RetentionPolicy
} from '../types/recordingTypes'
import {
  RECORDING_MODE_LABELS,
  QUALITY_LABELS,
  STORAGE_TIER_LABELS,
  EXPORT_PERMISSION_LABELS
} from '../types/recordingTypes'

type StoragePolicyFormProps = {
  policy: StoragePolicy
  onSave: (policy: StoragePolicy) => void
  onCancel: () => void
}

export function StoragePolicyForm({ policy, onSave, onCancel }: StoragePolicyFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<StoragePolicy>(policy)

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    })
    toast({
      title: 'Politica salva',
      description: 'A politica de gravacao foi atualizada com sucesso.'
    })
  }

  const handleAddRetentionPolicy = () => {
    const newRetention: RetentionPolicy = {
      id: `ret-${Date.now()}`,
      name: 'Nova Politica',
      retentionDays: 30,
      storageTier: 'warm',
      autoArchive: false
    }
    setFormData({
      ...formData,
      retentionPolicies: [...formData.retentionPolicies, newRetention]
    })
  }

  const handleRemoveRetentionPolicy = (retId: string) => {
    setFormData({
      ...formData,
      retentionPolicies: formData.retentionPolicies.filter((r) => r.id !== retId)
    })
  }

  const handleRetentionChange = (retId: string, field: keyof RetentionPolicy, value: unknown) => {
    setFormData({
      ...formData,
      retentionPolicies: formData.retentionPolicies.map((r) =>
        r.id === retId ? { ...r, [field]: value } : r
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Editar Politica de Gravacao</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informacoes Gerais */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informacoes Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Nome da Politica</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Descricao</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Modo de Gravacao</Label>
                <Select
                  value={formData.recordingMode}
                  onValueChange={(value: RecordingMode) =>
                    setFormData({ ...formData, recordingMode: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RECORDING_MODE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Qualidade Padrao</Label>
                <Select
                  value={formData.defaultQuality}
                  onValueChange={(value: RecordingQuality) =>
                    setFormData({ ...formData, defaultQuality: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(QUALITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuracao de Retencao */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Retencao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Retencao Padrao (dias)</Label>
                <Input
                  type="number"
                  value={formData.defaultRetentionDays}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultRetentionDays: parseInt(e.target.value) || 30 })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Retencao Maxima (dias)</Label>
                <Input
                  type="number"
                  value={formData.maxRetentionDays}
                  onChange={(e) =>
                    setFormData({ ...formData, maxRetentionDays: parseInt(e.target.value) || 365 })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Alerta de Storage (%)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[formData.alertThresholdPercent]}
                  onValueChange={(value) =>
                    setFormData({ ...formData, alertThresholdPercent: value[0] })
                  }
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-slate-700 w-12">
                  {formData.alertThresholdPercent}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Cota de Storage (GB)</Label>
                <Input
                  type="number"
                  value={formData.storageQuotaGB}
                  onChange={(e) =>
                    setFormData({ ...formData, storageQuotaGB: parseInt(e.target.value) || 1000 })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Em uso (GB)</Label>
                <Input
                  type="number"
                  value={formData.usedStorageGB}
                  disabled
                  className="mt-1 bg-slate-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Politicas de Retencao */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Camadas de Armazenamento</CardTitle>
            <Button size="sm" variant="outline" onClick={handleAddRetentionPolicy}>
              <Plus className="mr-1 h-3 w-3" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.retentionPolicies.map((ret) => (
              <div
                key={ret.id}
                className="rounded-lg border border-slate-200 p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Input
                    value={ret.name}
                    onChange={(e) => handleRetentionChange(ret.id, 'name', e.target.value)}
                    className="max-w-[200px] h-8 text-sm"
                    placeholder="Nome da camada"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                    onClick={() => handleRemoveRetentionPolicy(ret.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px]">Dias</Label>
                    <Input
                      type="number"
                      value={ret.retentionDays}
                      onChange={(e) =>
                        handleRetentionChange(ret.id, 'retentionDays', parseInt(e.target.value) || 7)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px]">Tier</Label>
                    <Select
                      value={ret.storageTier}
                      onValueChange={(value: StorageTier) =>
                        handleRetentionChange(ret.id, 'storageTier', value)
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STORAGE_TIER_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={ret.autoArchive}
                    onCheckedChange={(checked) =>
                      handleRetentionChange(ret.id, 'autoArchive', checked)
                    }
                  />
                  <Label className="text-xs">Arquivar automaticamente</Label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Politica de Exportacao */}
        <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Exportacao de Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Formato</Label>
                <Select
                  value={formData.exportPolicy.format}
                  onValueChange={(value: ExportFormat) =>
                    setFormData({
                      ...formData,
                      exportPolicy: { ...formData.exportPolicy, format: value }
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="mkv">MKV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Duracao Max (min)</Label>
                <Input
                  type="number"
                  value={formData.exportPolicy.maxDurationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exportPolicy: {
                        ...formData.exportPolicy,
                        maxDurationMinutes: parseInt(e.target.value) || 60
                      }
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Permissao</Label>
              <Select
                value={formData.exportPolicy.permission}
                onValueChange={(value: ExportPermission) =>
                  setFormData({
                    ...formData,
                    exportPolicy: { ...formData.exportPolicy, permission: value }
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPORT_PERMISSION_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Marca d'agua</Label>
                <Switch
                  checked={formData.exportPolicy.watermarkEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      exportPolicy: { ...formData.exportPolicy, watermarkEnabled: checked }
                    })
                  }
                />
              </div>
              {formData.exportPolicy.watermarkEnabled && (
                <Input
                  value={formData.exportPolicy.watermarkText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      exportPolicy: { ...formData.exportPolicy, watermarkText: e.target.value }
                    })
                  }
                  placeholder="Texto da marca d'agua"
                  className="text-sm"
                />
              )}
              <div className="flex items-center justify-between">
                <Label className="text-xs">Requer aprovacao</Label>
                <Switch
                  checked={formData.exportPolicy.requireApproval}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      exportPolicy: { ...formData.exportPolicy, requireApproval: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Auditoria ativada</Label>
                <Switch
                  checked={formData.exportPolicy.auditEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      exportPolicy: { ...formData.exportPolicy, auditEnabled: checked }
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
