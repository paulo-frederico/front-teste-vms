import { useState } from 'react'
import {
  HardDrive,
  Settings,
  ChevronDown,
  ChevronUp,
  Building2,
  Clock,
  Download,
  Archive,
  Calendar
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { StoragePolicy } from '../types/recordingTypes'
import {
  RECORDING_MODE_LABELS,
  QUALITY_LABELS,
  STORAGE_TIER_LABELS,
  EXPORT_PERMISSION_LABELS
} from '../types/recordingTypes'

type StoragePolicyCardProps = {
  policy: StoragePolicy
  onEdit: (policyId: string) => void
}

export function StoragePolicyCard({ policy, onEdit }: StoragePolicyCardProps) {
  const [expanded, setExpanded] = useState(false)

  const storagePercent = Math.round((policy.usedStorageGB / policy.storageQuotaGB) * 100)

  const getStorageColor = (percent: number) => {
    if (percent >= 90) return 'bg-red-500'
    if (percent >= policy.alertThresholdPercent) return 'bg-orange-500'
    return 'bg-green-500'
  }

  const getStorageTextColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600'
    if (percent >= policy.alertThresholdPercent) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <Card className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
              <HardDrive className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{policy.name}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{policy.description}</p>
              {policy.tenantName && (
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Building2 className="h-3 w-3" />
                  {policy.tenantName}
                </div>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onEdit(policy.id)}>
            <Settings className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        {/* Storage Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Uso de Armazenamento</span>
            <span className={`text-sm font-semibold ${getStorageTextColor(storagePercent)}`}>
              {storagePercent}%
            </span>
          </div>
          <Progress value={storagePercent} className={`h-2 ${getStorageColor(storagePercent)}`} />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">
              {(policy.usedStorageGB / 1000).toFixed(1)} TB usado
            </span>
            <span className="text-xs text-slate-400">
              {(policy.storageQuotaGB / 1000).toFixed(1)} TB total
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="mr-1 h-3 w-3" />
            {policy.defaultRetentionDays} dias retencao
          </Badge>
          <Badge variant="outline" className="text-xs">
            {RECORDING_MODE_LABELS[policy.recordingMode]}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {policy.defaultQuality}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Download className="mr-1 h-3 w-3" />
            {EXPORT_PERMISSION_LABELS[policy.exportPolicy.permission]}
          </Badge>
        </div>

        {/* Expandir */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center gap-1 rounded-md py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> Recolher detalhes
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Ver detalhes
            </>
          )}
        </button>

        {/* Detalhes Expandidos */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
            {/* Politicas de Retencao */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Politicas de Retencao
              </h4>
              <div className="space-y-2">
                {policy.retentionPolicies.map((ret) => (
                  <div
                    key={ret.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">{ret.name}</p>
                      <p className="text-xs text-slate-500">
                        {STORAGE_TIER_LABELS[ret.storageTier]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {ret.retentionDays} dias
                      </p>
                      {ret.autoArchive && (
                        <p className="text-xs text-slate-400">
                          Arquivar apos {ret.archiveAfterDays}d
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agendamentos */}
            {policy.schedules.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Agendamentos
                </h4>
                <div className="space-y-2">
                  {policy.schedules.map((sched) => (
                    <div key={sched.id} className="rounded-lg bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-700">{sched.name}</p>
                        <Badge variant={sched.enabled ? 'default' : 'secondary'} className="text-xs">
                          {sched.enabled ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      {sched.periods.map((period) => (
                        <div key={period.id} className="text-xs text-slate-500">
                          <span className="font-medium">
                            {period.days.map(d => d.substring(0, 3).toUpperCase()).join(', ')}
                          </span>
                          {' '}das {period.startTime} as {period.endTime}
                          {' - '}{RECORDING_MODE_LABELS[period.mode]} ({period.quality})
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Politica de Exportacao */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Politica de Exportacao
              </h4>
              <div className="rounded-lg bg-slate-50 px-3 py-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Formato</span>
                  <span className="font-medium text-slate-700">{policy.exportPolicy.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Duracao maxima</span>
                  <span className="font-medium text-slate-700">{policy.exportPolicy.maxDurationMinutes} min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Marca d'agua</span>
                  <span className="font-medium text-slate-700">
                    {policy.exportPolicy.watermarkEnabled ? 'Sim' : 'Nao'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Requer aprovacao</span>
                  <span className="font-medium text-slate-700">
                    {policy.exportPolicy.requireApproval ? 'Sim' : 'Nao'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
