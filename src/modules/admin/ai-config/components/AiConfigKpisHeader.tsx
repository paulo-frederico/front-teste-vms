import { Camera, Layers, Target, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type KpiData = {
  totalCameras: number
  totalModulesActive: number
  totalZones: number
  avgSensitivity: number
}

type AiConfigKpisHeaderProps = {
  kpis: KpiData
}

export function AiConfigKpisHeader({ kpis }: AiConfigKpisHeaderProps) {
  const kpiItems = [
    {
      label: 'Cameras com IA',
      value: kpis.totalCameras,
      icon: Camera,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Modulos Ativos',
      value: kpis.totalModulesActive,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Zonas Configuradas',
      value: kpis.totalZones,
      icon: Layers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Sensibilidade Media',
      value: `${kpis.avgSensitivity}%`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
