import { useState } from 'react'
import { X, Plus, Save } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { AI_TYPE_LABELS, type AiEventSeverity, type AiEventType } from '../mockAiEvents'
import type { AlertRule, AlertRuleScope } from '../mockAlertRules'
import { RULE_SCOPE_LABELS, WEEKDAY_LABELS } from '../mockAlertRules'

type CreateAlertRuleModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (rule: AlertRule) => void
}

const AI_TYPES: AiEventType[] = ['intrusion', 'line_cross', 'lpr', 'people_count', 'vehicle_count', 'loitering', 'epi']
const SEVERITIES: AiEventSeverity[] = ['low', 'medium', 'high', 'critical']
const SCOPES: AlertRuleScope[] = ['GLOBAL', 'TENANT_TEMPLATE']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SEVERITY_LABELS: Record<AiEventSeverity, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
}

export function CreateAlertRuleModal({ open, onOpenChange, onSave }: CreateAlertRuleModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [aiType, setAiType] = useState<AiEventType>('intrusion')
  const [severity, setSeverity] = useState<AiEventSeverity>('medium')
  const [scope, setScope] = useState<AlertRuleScope>('GLOBAL')
  const [enabled, setEnabled] = useState(true)
  const [startHour, setStartHour] = useState('00:00')
  const [endHour, setEndHour] = useState('23:59')
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  const [isSaving, setIsSaving] = useState(false)

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Nome da regra é obrigatório')
      return
    }

    if (selectedDays.length === 0) {
      toast.error('Selecione pelo menos um dia da semana')
      return
    }

    setIsSaving(true)

    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newRule: AlertRule = {
      id: `rule-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      aiType,
      defaultSeverity: severity,
      enabled,
      scope,
      activeHours: `${startHour} - ${endHour}`,
      daysOfWeek: selectedDays,
    }

    onSave(newRule)
    toast.success('Regra global criada com sucesso!')

    // Reset form
    setName('')
    setDescription('')
    setAiType('intrusion')
    setSeverity('medium')
    setScope('GLOBAL')
    setEnabled(true)
    setStartHour('00:00')
    setEndHour('23:59')
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Nova regra</p>
                <SheetTitle className="mt-1">Criar regra global de IA</SheetTitle>
              </div>
            </div>
            <SheetDescription>
              Defina uma nova regra de alerta que será aplicada globalmente ou como template para tenants.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 p-6">
            {/* Nome e Descrição */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da regra *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Detecção de intrusão noturna"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva quando e como esta regra deve ser aplicada..."
                  className="mt-1.5 min-h-[80px]"
                />
              </div>
            </div>

            {/* Módulo IA e Severidade */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Módulo de IA *</Label>
                <Select value={aiType} onValueChange={(v) => setAiType(v as AiEventType)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {AI_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severidade padrão *</Label>
                <Select value={severity} onValueChange={(v) => setSeverity(v as AiEventSeverity)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((sev) => (
                      <SelectItem key={sev} value={sev}>
                        {SEVERITY_LABELS[sev]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Escopo e Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Escopo *</Label>
                <Select value={scope} onValueChange={(v) => setScope(v as AlertRuleScope)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCOPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {RULE_SCOPE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <Label>Status</Label>
                  <p className="text-xs text-slate-500">Ativar regra imediatamente</p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </div>
            </div>

            {/* Janela de horário */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Label className="mb-3 block">Janela de horário ativo</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-slate-500">Início</Label>
                  <Input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Fim</Label>
                  <Input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Dias da semana */}
            <div>
              <Label className="mb-3 block">Dias da semana aplicados</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {WEEKDAY_LABELS[day]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer com botões */}
          <div className="border-t border-slate-100 p-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 gap-2 bg-slate-900"
                disabled={isSaving}
              >
                {isSaving ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Criar regra
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
