import { Video, HardDrive, Camera, CirclePlay } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type KpiData = {
  totalCameras: number
  recordingActive: number
  totalStorageUsedGB: number
  totalStorageQuotaGB: number
  storageUsagePercent: number
  totalPolicies: number
}

type RecordingKpisHeaderProps = {
  kpis: KpiData
}

export function RecordingKpisHeader({ kpis }: RecordingKpisHeaderProps) {
  const getStorageColor = (percent: number) => {
    if (percent >= 90) return 'text-red-600 bg-red-50'
    if (percent >= 75) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  const kpiItems = [
    {
      label: 'Cameras com Gravacao',
      value: kpis.totalCameras,
      icon: Camera,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Gravando Agora',
      value: kpis.recordingActive,
      icon: CirclePlay,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Storage Usado',
      value: `${(kpis.totalStorageUsedGB / 1000).toFixed(1)} TB`,
      subValue: `de ${(kpis.totalStorageQuotaGB / 1000).toFixed(1)} TB`,
      icon: HardDrive,
      color: getStorageColor(kpis.storageUsagePercent).split(' ')[0],
      bgColor: getStorageColor(kpis.storageUsagePercent).split(' ')[1]
    },
    {
      label: 'Politicas Ativas',
      value: kpis.totalPolicies,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {kpiItems.map((kpi) => (
        <Card key={kpi.label} className="border-0 bg-white shadow-sm ring-1 ring-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{kpi.label}</p>
                <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                {kpi.subValue && (
                  <p className="text-xs text-slate-400">{kpi.subValue}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
