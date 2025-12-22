import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  FileText,
  Calendar,
  Clock,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Camera,
  AlertTriangle,
  FileSpreadsheet,
  Mail,
  RefreshCw
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageIntro } from '@/modules/shared/components/PageIntro'

const REPORT_TEMPLATES = [
  {
    id: 'executive',
    name: 'Relatório Executivo',
    description: 'Visão consolidada de KPIs, tendências e alertas críticos.',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-600',
    lastGenerated: '15 dez 2024, 08:00',
    format: ['PDF', 'PPTX'],
  },
  {
    id: 'operational',
    name: 'Relatório Operacional',
    description: 'Detalhamento de câmeras, uptime e incidentes por tenant.',
    icon: Camera,
    color: 'bg-green-100 text-green-600',
    lastGenerated: '14 dez 2024, 18:30',
    format: ['PDF', 'CSV'],
  },
  {
    id: 'ai-events',
    name: 'Eventos de IA',
    description: 'Análise de eventos de inteligência artificial por tipo e severidade.',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600',
    lastGenerated: '15 dez 2024, 06:00',
    format: ['PDF', 'CSV', 'JSON'],
  },
  {
    id: 'users',
    name: 'Atividade de Usuários',
    description: 'Acessos, ações e permissões de todos os usuários do sistema.',
    icon: Users,
    color: 'bg-orange-100 text-orange-600',
    lastGenerated: '13 dez 2024, 12:00',
    format: ['PDF', 'CSV'],
  },
  {
    id: 'alerts',
    name: 'Alertas e Incidentes',
    description: 'Histórico de alertas críticos e tempo de resposta.',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-600',
    lastGenerated: '15 dez 2024, 07:00',
    format: ['PDF', 'CSV'],
  },
  {
    id: 'storage',
    name: 'Consumo de Storage',
    description: 'Uso de armazenamento por tenant, local e câmera.',
    icon: PieChart,
    color: 'bg-cyan-100 text-cyan-600',
    lastGenerated: '12 dez 2024, 00:00',
    format: ['PDF', 'CSV'],
  },
]

const SCHEDULED_REPORTS = [
  { name: 'Executivo Semanal', frequency: 'Toda segunda, 08:00', recipients: 3, status: 'active' },
  { name: 'Operacional Diário', frequency: 'Diariamente, 07:00', recipients: 5, status: 'active' },
  { name: 'Alertas Críticos', frequency: 'A cada 6 horas', recipients: 2, status: 'active' },
]

export function AdminReportsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [tenantFilter, setTenantFilter] = useState('all')
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const handleExport = async (reportId: string, format: string) => {
    setIsExporting(reportId)
    await new Promise(r => setTimeout(r, 1500))
    toast.success(`Relatório exportado em ${format} com sucesso!`)
    setIsExporting(null)
  }

  const handleSchedule = () => {
    toast.info('Funcionalidade de agendamento será implementada em breve')
  }

  return (
    <section className="space-y-6">
      <PageIntro
        title="Relatórios e auditoria"
        description="Gere relatórios operacionais, exporte planos de ação e consulte o histórico completo de auditoria por usuário."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSchedule}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendar envio
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Enviar por email
            </Button>
          </div>
        }
      />

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Período:</span>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Cliente:</span>
              <Select value={tenantFilter} onValueChange={setTenantFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  <SelectItem value="t1">Supermercados ABC</SelectItem>
                  <SelectItem value="t2">Indústria XYZ</SelectItem>
                  <SelectItem value="t3">Condomínio Parque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates de Relatório */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Templates de Relatório</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REPORT_TEMPLATES.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <report.icon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    {report.format.map((fmt) => (
                      <span key={fmt} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded font-medium">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                <CardDescription className="text-xs">{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {report.lastGenerated}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleExport(report.id, 'PDF')}
                    disabled={isExporting === report.id}
                  >
                    {isExporting === report.id ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleExport(report.id, 'CSV')}
                    disabled={isExporting === report.id}
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Relatórios Agendados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Relatórios Agendados
          </CardTitle>
          <CardDescription>Envios automáticos configurados para sua organização.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SCHEDULED_REPORTS.map((scheduled, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{scheduled.name}</p>
                    <p className="text-xs text-gray-500">{scheduled.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{scheduled.recipients} destinatários</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 gap-2">
            <Calendar className="w-4 h-4" />
            Criar novo agendamento
          </Button>
        </CardContent>
      </Card>

      {/* Preview de Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia do Relatório</CardTitle>
          <CardDescription>Visualização rápida dos dados do período selecionado.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Câmeras Ativas', value: '1,247', change: '+12%', positive: true },
              { label: 'Eventos IA', value: '45.2K', change: '+8%', positive: true },
              { label: 'Alertas Críticos', value: '156', change: '-23%', positive: true },
              { label: 'Uptime Médio', value: '99.7%', change: '+0.2%', positive: true },
            ].map((kpi, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">{kpi.label}</p>
                <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                <span className={`text-xs ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change} vs período anterior
                </span>
              </div>
            ))}
          </div>

          {/* Gráfico mockado */}
          <div className="h-48 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-end justify-between px-4 pb-4 gap-1">
            {Array.from({ length: 30 }).map((_, idx) => {
              const height = 20 + Math.random() * 80
              return (
                <div
                  key={idx}
                  className="flex-1 bg-blue-400 rounded-t hover:bg-blue-500 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`Dia ${idx + 1}`}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>1 dez</span>
            <span>15 dez</span>
            <span>30 dez</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
