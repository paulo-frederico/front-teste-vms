/**
 * Página de Diagnóstico de Câmeras do Técnico
 * Ferramentas para diagnóstico e troubleshooting
 */

import { useState } from 'react'
import {
  Wrench,
  Wifi,
  HardDrive,
  Thermometer,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Loader2,
  Signal,
  Zap,
  Server,
  Network,
  Activity,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock data - câmeras autorizadas para diagnóstico
const mockCamerasAutorizadas = [
  {
    id: 'CAM-001',
    nome: 'Entrada Principal',
    cliente: 'Hospital Vida Plena',
    modelo: 'Hikvision DS-2CD2143G2-I',
    ip: '192.168.1.101',
    status: 'online',
    ultimaVerificacao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-002',
    nome: 'Recepção',
    cliente: 'Hospital Vida Plena',
    modelo: 'Hikvision DS-2CD2143G2-I',
    ip: '192.168.1.102',
    status: 'online',
    ultimaVerificacao: '2024-01-14T10:30:00',
  },
  {
    id: 'CAM-003',
    nome: 'Corredor UTI',
    cliente: 'Hospital Vida Plena',
    modelo: 'Dahua IPC-HDW2431T-AS',
    ip: '192.168.1.103',
    status: 'offline',
    ultimaVerificacao: '2024-01-14T08:00:00',
  },
  {
    id: 'CAM-015',
    nome: 'Estacionamento A',
    cliente: 'Retail Park Brasil',
    modelo: 'Intelbras VIP 3230 B',
    ip: '192.168.2.15',
    status: 'online',
    ultimaVerificacao: '2024-01-14T10:30:00',
  },
]

// Mock de resultado de diagnóstico
const mockDiagnosticoResultado = {
  camera: 'CAM-003',
  executadoEm: '2024-01-14T10:35:00',
  testes: [
    {
      nome: 'Conectividade de Rede',
      descricao: 'Verifica se a câmera responde a ping',
      status: 'falha',
      detalhes: 'Timeout após 5 tentativas. Verificar cabo de rede ou switch.',
      icone: Network,
    },
    {
      nome: 'Porta RTSP (554)',
      descricao: 'Verifica se a porta de streaming está acessível',
      status: 'falha',
      detalhes: 'Não foi possível conectar. Câmera offline ou bloqueio de firewall.',
      icone: Signal,
    },
    {
      nome: 'Porta HTTP (80)',
      descricao: 'Verifica acesso à interface web',
      status: 'falha',
      detalhes: 'Conexão recusada.',
      icone: Server,
    },
    {
      nome: 'Alimentação PoE',
      descricao: 'Status da alimentação via PoE',
      status: 'aviso',
      detalhes: 'Não foi possível verificar remotamente. Verificar fisicamente.',
      icone: Zap,
    },
  ],
  recomendacoes: [
    'Verificar se o cabo de rede está conectado corretamente',
    'Verificar LED de status na câmera',
    'Testar outra porta no switch PoE',
    'Verificar se o switch PoE está funcionando',
    'Se persistir, pode ser necessário reiniciar ou substituir a câmera',
  ],
}

export function TechnicianDiagnosticsPage() {
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false)
  const [diagnosticResult, setDiagnosticResult] = useState<typeof mockDiagnosticoResultado | null>(null)
  const [diagnosticProgress, setDiagnosticProgress] = useState(0)

  const handleRunDiagnostic = async () => {
    if (!selectedCamera) return

    setIsRunningDiagnostic(true)
    setDiagnosticResult(null)
    setDiagnosticProgress(0)

    // Simular progresso
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setDiagnosticProgress(i)
    }

    // Simular resultado
    setDiagnosticResult(mockDiagnosticoResultado)
    setIsRunningDiagnostic(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'falha':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'aviso':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'falha':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'aviso':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-deep">Diagnóstico de Câmeras</h1>
        <p className="text-muted-foreground">Ferramentas para identificar e resolver problemas</p>
      </div>

      {/* Seleção de Câmera */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selecionar Câmera</CardTitle>
          <CardDescription>
            Escolha uma câmera autorizada para executar o diagnóstico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione uma câmera..." />
              </SelectTrigger>
              <SelectContent>
                {mockCamerasAutorizadas.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      )} />
                      <span>{camera.nome}</span>
                      <span className="text-muted-foreground">({camera.cliente})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleRunDiagnostic}
              disabled={!selectedCamera || isRunningDiagnostic}
            >
              {isRunningDiagnostic ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Executar Diagnóstico
                </>
              )}
            </Button>
          </div>

          {/* Info da câmera selecionada */}
          {selectedCamera && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              {(() => {
                const camera = mockCamerasAutorizadas.find(c => c.id === selectedCamera)
                if (!camera) return null
                return (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Modelo</p>
                      <p className="font-medium">{camera.modelo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Endereço IP</p>
                      <p className="font-medium font-mono">{camera.ip}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant="outline" className={cn(
                        camera.status === 'online' ? 'text-green-700' : 'text-red-700'
                      )}>
                        {camera.status === 'online' ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Última Verificação</p>
                      <p className="font-medium">
                        {new Date(camera.ultimaVerificacao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress durante execução */}
      {isRunningDiagnostic && (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-lg font-medium">Executando diagnóstico...</span>
              </div>
              <Progress value={diagnosticProgress} className="max-w-md mx-auto" />
              <p className="text-center text-sm text-muted-foreground">
                Testando conectividade e serviços da câmera
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado do Diagnóstico */}
      {diagnosticResult && !isRunningDiagnostic && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resultado do Diagnóstico
                </CardTitle>
                <CardDescription>
                  Executado em: {new Date(diagnosticResult.executadoEm).toLocaleString('pt-BR')}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleRunDiagnostic}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Executar Novamente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="testes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="testes">Testes Executados</TabsTrigger>
                <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
              </TabsList>

              <TabsContent value="testes" className="mt-4 space-y-4">
                {diagnosticResult.testes.map((teste, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border',
                      teste.status === 'falha' && 'bg-red-50 border-red-200',
                      teste.status === 'sucesso' && 'bg-green-50 border-green-200',
                      teste.status === 'aviso' && 'bg-yellow-50 border-yellow-200'
                    )}
                  >
                    <div className="p-2 rounded-lg bg-white shadow-sm">
                      <teste.icone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{teste.nome}</span>
                        {getStatusIcon(teste.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{teste.descricao}</p>
                      <p className="text-sm mt-2">{teste.detalhes}</p>
                    </div>
                    <Badge variant="outline" className={cn(getStatusColor(teste.status))}>
                      {teste.status === 'sucesso' && 'OK'}
                      {teste.status === 'falha' && 'Falha'}
                      {teste.status === 'aviso' && 'Aviso'}
                    </Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="recomendacoes" className="mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Ações Recomendadas
                  </h4>
                  <ol className="space-y-2">
                    {diagnosticResult.recomendacoes.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-blue-800">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{rec}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Ferramentas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ferramentas Rápidas</CardTitle>
          <CardDescription>Ações comuns de manutenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" disabled={!selectedCamera}>
              <RefreshCw className="h-5 w-5" />
              <span>Reiniciar Câmera</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" disabled={!selectedCamera}>
              <Wifi className="h-5 w-5" />
              <span>Testar Conexão</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" disabled={!selectedCamera}>
              <HardDrive className="h-5 w-5" />
              <span>Info do Sistema</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" disabled={!selectedCamera}>
              <Thermometer className="h-5 w-5" />
              <span>Status Térmico</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Câmeras Autorizadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Câmeras Autorizadas</CardTitle>
          <CardDescription>Todas as câmeras que você pode diagnosticar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockCamerasAutorizadas.map((camera) => (
              <div
                key={camera.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedCamera === camera.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                )}
                onClick={() => setSelectedCamera(camera.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'h-3 w-3 rounded-full',
                    camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  )} />
                  <div>
                    <p className="font-medium">{camera.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {camera.cliente} • {camera.ip}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  'text-xs',
                  camera.status === 'online' ? 'text-green-700' : 'text-red-700'
                )}>
                  {camera.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
