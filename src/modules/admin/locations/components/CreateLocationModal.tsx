import { useState } from 'react'
import { MapPin, Save } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import type { AdminLocation } from '../mockLocations'

type CreateLocationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (location: AdminLocation) => void
  tenantOptions: { value: string; label: string }[]
}

export function CreateLocationModal({ open, onOpenChange, onSave, tenantOptions }: CreateLocationModalProps) {
  const [name, setName] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [responsibleName, setResponsibleName] = useState('')
  const [responsiblePhone, setResponsiblePhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const selectedTenant = tenantOptions.find((t) => t.value === tenantId)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Nome do local é obrigatório')
      return
    }

    if (!tenantId) {
      toast.error('Selecione um cliente')
      return
    }

    setIsSaving(true)

    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newLocation: AdminLocation = {
      id: `loc-${Date.now()}`,
      tenantId,
      tenantName: selectedTenant?.label || '',
      name: name.trim(),
      cameras: 0,
      onlineCameras: 0,
      offlineCameras: 0,
      unstableCameras: 0,
      maintenanceCameras: 0,
      createdAt: new Date().toISOString(),
    }

    onSave(newLocation)
    toast.success('Local criado com sucesso!')

    // Reset form
    setName('')
    setTenantId('')
    setAddress('')
    setCity('')
    setState('')
    setResponsibleName('')
    setResponsiblePhone('')
    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <MapPin className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Novo local</p>
                <SheetTitle className="mt-1">Cadastrar local</SheetTitle>
              </div>
            </div>
            <SheetDescription>
              Adicione um novo local (filial, loja, galpão, etc.) para organizar as câmeras de um cliente.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 p-6">
            {/* Cliente */}
            <div>
              <Label>Cliente *</Label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {tenantOptions.map((tenant) => (
                    <SelectItem key={tenant.value} value={tenant.value}>
                      {tenant.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nome do Local */}
            <div>
              <Label htmlFor="name">Nome do local *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Matriz Centro, Filial Norte, Galpão Industrial"
                className="mt-1.5"
              />
            </div>

            {/* Endereço */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Label className="mb-3 block text-sm font-medium">Endereço</Label>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-500">Logradouro</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, complemento"
                    className="mt-1"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-slate-500">Cidade</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Estado</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((uf) => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsável */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Label className="mb-3 block text-sm font-medium">Responsável local</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs text-slate-500">Nome</Label>
                  <Input
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    placeholder="Nome do responsável"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Telefone</Label>
                  <Input
                    value={responsiblePhone}
                    onChange={(e) => setResponsiblePhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-medium">Próximos passos</p>
              <p className="mt-1 text-xs">
                Após criar o local, você poderá adicionar câmeras e configurar áreas de monitoramento.
              </p>
            </div>
          </div>

          {/* Footer */}
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
                    Criar local
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
