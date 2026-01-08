/**
 * Painel de Casos para o Módulo de Investigação
 * Gerenciamento de casos com clipes, eventos, notas e audit trail
 */

import { useState, useCallback, memo } from 'react'
import {
  Plus,
  Folder,
  FileVideo,
  MessageSquare,
  History,
  Download,
  Share2,
  Trash2,
  ChevronDown,
  Clock,
  User,
  Tag,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Case, CaseClip, CaseEvent, CaseNote, CaseAuditEntry } from '@/modules/shared/types/investigation'
import { CasePriority } from '@/modules/shared/types/investigation'
import {
  caseStatusLabels,
  caseStatusColors,
  casePriorityLabels,
  casePriorityColors,
  auditActionLabels,
} from '@/mocks/cases.mock'
import { eventTypeLabels, eventTypeColors } from '@/mocks/events.mock'

interface CasePanelProps {
  cases: Case[]
  selectedCase: Case | null
  onSelectCase: (caseItem: Case | null) => void
  onCreateCase: (title: string, description: string, priority: CasePriority) => Promise<void>
  onAddNote: (caseId: string, content: string) => Promise<void>
  onRemoveClip: (caseId: string, clipId: string) => Promise<void>
  onRemoveEvent: (caseId: string, eventId: string) => Promise<void>
  onExport: (caseId: string) => Promise<void>
  onShare: (caseId: string) => Promise<void>
  isLoading?: boolean
}

// Formatar timestamp
const formatShortDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Componente de item de clipe
const ClipItem = memo(function ClipItem({
  clip,
  onRemove,
}: {
  clip: CaseClip
  onRemove: () => void
}) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 group">
      <div className="w-16 h-10 bg-muted rounded flex items-center justify-center shrink-0">
        <FileVideo className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{clip.cameraName}</p>
        <p className="text-xs text-muted-foreground">
          {formatShortDate(clip.startTime)} - {Math.floor(clip.durationSeconds / 60)}min
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
        onClick={onRemove}
        aria-label="Remover clipe"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
})

// Componente de item de evento
const CaseEventItem = memo(function CaseEventItem({
  caseEvent,
  onRemove,
}: {
  caseEvent: CaseEvent
  onRemove: () => void
}) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 group">
      <div
        className="w-2 h-2 mt-2 rounded-full shrink-0"
        style={{ backgroundColor: eventTypeColors[caseEvent.event.type] }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{eventTypeLabels[caseEvent.event.type]}</p>
        <p className="text-xs text-muted-foreground truncate">
          {caseEvent.event.cameraName} - {formatShortDate(caseEvent.event.timestamp)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
        onClick={onRemove}
        aria-label="Remover evento"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
})

// Componente de nota
const NoteItem = memo(function NoteItem({ note }: { note: CaseNote }) {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
      <p className="text-xs text-muted-foreground mt-2">
        {note.createdByName} - {formatShortDate(note.createdAt)}
      </p>
    </div>
  )
})

// Componente de audit entry
const AuditItem = memo(function AuditItem({ entry }: { entry: CaseAuditEntry }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-muted-foreground shrink-0" />
      <div>
        <span className="font-medium">{auditActionLabels[entry.action] || entry.action}</span>
        <span className="text-muted-foreground"> - {entry.performedByName}</span>
        <span className="text-muted-foreground block">{formatShortDate(entry.performedAt)}</span>
      </div>
    </div>
  )
})

// Componente de seletor de caso
const CaseSelector = memo(function CaseSelector({
  cases,
  selectedCase,
  onSelect,
  onCreateNew,
}: {
  cases: Case[]
  selectedCase: Case | null
  onSelect: (caseItem: Case | null) => void
  onCreateNew: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between h-9">
          <span className="flex items-center gap-2 truncate">
            <Folder className="h-4 w-4 shrink-0" />
            {selectedCase ? (
              <span className="truncate">{selectedCase.title}</span>
            ) : (
              <span className="text-muted-foreground">Selecionar caso</span>
            )}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuItem onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Criar novo caso
        </DropdownMenuItem>
        {cases.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {cases.map((caseItem) => (
              <DropdownMenuItem
                key={caseItem.id}
                onClick={() => onSelect(caseItem)}
                className="flex flex-col items-start py-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium truncate flex-1">{caseItem.title}</span>
                  <Badge className={cn('text-[10px] h-4', caseStatusColors[caseItem.status])}>
                    {caseStatusLabels[caseItem.status]}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {caseItem.clips.length} clipes, {caseItem.events.length} eventos
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

// Dialog para criar caso
const CreateCaseDialog = memo(function CreateCaseDialog({
  open,
  onClose,
  onCreate,
  isLoading,
}: {
  open: boolean
  onClose: () => void
  onCreate: (title: string, description: string, priority: CasePriority) => Promise<void>
  isLoading: boolean
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<CasePriority>(CasePriority.MEDIUM)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await onCreate(title.trim(), description.trim(), priority)
    setTitle('')
    setDescription('')
    setPriority(CasePriority.MEDIUM)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Caso</DialogTitle>
          <DialogDescription>
            Crie um novo caso para agrupar evidências de uma investigação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case-title">Título</Label>
            <Input
              id="case-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Incidente na entrada principal"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-description">Descrição</Label>
            <Textarea
              id="case-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o caso..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-priority">Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as CasePriority)}>
              <SelectTrigger id="case-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CasePriority).map((p) => (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full',
                          p === CasePriority.LOW && 'bg-gray-400',
                          p === CasePriority.MEDIUM && 'bg-blue-500',
                          p === CasePriority.HIGH && 'bg-orange-500',
                          p === CasePriority.URGENT && 'bg-red-500'
                        )}
                      />
                      {casePriorityLabels[p]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Caso
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})

// Dialog para adicionar nota
const AddNoteDialog = memo(function AddNoteDialog({
  open,
  onClose,
  onAdd,
  isLoading,
}: {
  open: boolean
  onClose: () => void
  onAdd: (content: string) => Promise<void>
  isLoading: boolean
}) {
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    await onAdd(content.trim())
    setContent('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nota</DialogTitle>
          <DialogDescription>Adicione uma nota ou observação ao caso.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-content">Nota</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite sua nota..."
              rows={5}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!content.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
})

export const CasePanel = memo(function CasePanel({
  cases,
  selectedCase,
  onSelectCase,
  onCreateCase,
  onAddNote,
  onRemoveClip,
  onRemoveEvent,
  onExport,
  onShare,
  isLoading = false,
}: CasePanelProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleCreateCase = useCallback(
    async (title: string, description: string, priority: CasePriority) => {
      setIsCreating(true)
      try {
        await onCreateCase(title, description, priority)
      } finally {
        setIsCreating(false)
      }
    },
    [onCreateCase]
  )

  const handleAddNote = useCallback(
    async (content: string) => {
      if (!selectedCase) return
      setIsAddingNote(true)
      try {
        await onAddNote(selectedCase.id, content)
      } finally {
        setIsAddingNote(false)
      }
    },
    [selectedCase, onAddNote]
  )

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-9 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header com seletor de caso */}
      <div className="p-3 border-b">
        <CaseSelector
          cases={cases}
          selectedCase={selectedCase}
          onSelect={onSelectCase}
          onCreateNew={() => setShowCreateDialog(true)}
        />
      </div>

      {selectedCase ? (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Info do caso */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{selectedCase.title}</h3>
                <Badge className={cn('text-[10px]', caseStatusColors[selectedCase.status])}>
                  {caseStatusLabels[selectedCase.status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {selectedCase.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <Badge className={cn('text-[10px] h-4', casePriorityColors[selectedCase.priority])}>
                    {casePriorityLabels[selectedCase.priority]}
                  </Badge>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatShortDate(selectedCase.createdAt)}
                </span>
              </div>
            </div>

            {/* Ações do caso */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={() => onExport(selectedCase.id)}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={() => onShare(selectedCase.id)}
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Compartilhar
              </Button>
            </div>

            {/* Accordion com conteúdo */}
            <Accordion type="multiple" defaultValue={['clips', 'events', 'notes']} className="space-y-2">
              {/* Clipes */}
              <AccordionItem value="clips" className="border rounded-lg px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="flex items-center gap-2 text-sm">
                    <FileVideo className="h-4 w-4" />
                    Clipes ({selectedCase.clips.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  {selectedCase.clips.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Nenhum clipe adicionado
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {selectedCase.clips.map((clip) => (
                        <ClipItem
                          key={clip.id}
                          clip={clip}
                          onRemove={() => onRemoveClip(selectedCase.id, clip.id)}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Eventos */}
              <AccordionItem value="events" className="border rounded-lg px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Eventos ({selectedCase.events.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  {selectedCase.events.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      Nenhum evento adicionado
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {selectedCase.events.map((caseEvent) => (
                        <CaseEventItem
                          key={caseEvent.id}
                          caseEvent={caseEvent}
                          onRemove={() => onRemoveEvent(selectedCase.id, caseEvent.id)}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Notas */}
              <AccordionItem value="notes" className="border rounded-lg px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4" />
                    Notas ({selectedCase.notes.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-2">
                    {selectedCase.notes.map((note) => (
                      <NoteItem key={note.id} note={note} />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowNoteDialog(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Adicionar nota
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Audit Trail */}
              <AccordionItem value="audit" className="border rounded-lg px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="flex items-center gap-2 text-sm">
                    <History className="h-4 w-4" />
                    Histórico ({selectedCase.auditTrail.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-2">
                    {selectedCase.auditTrail
                      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
                      .slice(0, 10)
                      .map((entry) => (
                        <AuditItem key={entry.id} entry={entry} />
                      ))}
                    {selectedCase.auditTrail.length > 10 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{selectedCase.auditTrail.length - 10} entradas anteriores
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Responsáveis */}
              <AccordionItem value="assignees" className="border rounded-lg px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <span className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Responsáveis ({selectedCase.assignees.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-2">
                    {selectedCase.assignees.map((assignee) => (
                      <div key={assignee.id} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {assignee.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{assignee.name}</p>
                          <p className="text-xs text-muted-foreground">{assignee.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Folder className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground mb-2">Nenhum caso selecionado</p>
          <p className="text-xs text-muted-foreground mb-4">
            Selecione um caso existente ou crie um novo para começar a adicionar evidências.
          </p>
          <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar novo caso
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateCaseDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateCase}
        isLoading={isCreating}
      />

      <AddNoteDialog
        open={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        onAdd={handleAddNote}
        isLoading={isAddingNote}
      />
    </div>
  )
})
