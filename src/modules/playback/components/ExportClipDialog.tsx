/**
 * Dialog para exportação de clips de gravação
 */

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Download,
  Clock,
  Film,
  HardDrive,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

interface ExportClipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cameraName: string
  startTime: Date
  onExport: (config: ExportConfig) => void
}

interface ExportConfig {
  startTime: Date
  endTime: Date
  format: 'mp4' | 'avi' | 'mkv'
  quality: 'original' | 'high' | 'medium' | 'low'
}

type ExportStatus = 'idle' | 'exporting' | 'success' | 'error'

export function ExportClipDialog({
  open,
  onOpenChange,
  cameraName,
  startTime,
  onExport,
}: ExportClipDialogProps) {
  const [clipStartTime, setClipStartTime] = useState(() => {
    const start = new Date(startTime)
    start.setMinutes(start.getMinutes() - 1)
    return start
  })
  const [clipEndTime, setClipEndTime] = useState(() => {
    const end = new Date(startTime)
    end.setMinutes(end.getMinutes() + 1)
    return end
  })
  const [formatType, setFormatType] = useState<'mp4' | 'avi' | 'mkv'>('mp4')
  const [quality, setQuality] = useState<'original' | 'high' | 'medium' | 'low'>('high')
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle')
  const [exportProgress, setExportProgress] = useState(0)

  // Calcular duração do clip
  const durationMs = clipEndTime.getTime() - clipStartTime.getTime()
  const durationSeconds = Math.floor(durationMs / 1000)
  const durationMinutes = Math.floor(durationSeconds / 60)
  const durationSecondsRemainder = durationSeconds % 60

  // Estimar tamanho do arquivo (aproximado)
  const estimatedSizeMB = Math.round((durationSeconds * 2.5) * (
    quality === 'original' ? 1 :
    quality === 'high' ? 0.7 :
    quality === 'medium' ? 0.4 :
    0.2
  ))

  const handleExport = async () => {
    setExportStatus('exporting')
    setExportProgress(0)

    // Simular progresso de exportação
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setExportProgress(i)
    }

    // Simular conclusão
    setExportStatus('success')

    onExport({
      startTime: clipStartTime,
      endTime: clipEndTime,
      format: formatType,
      quality,
    })
  }

  const handleClose = () => {
    if (exportStatus !== 'exporting') {
      setExportStatus('idle')
      setExportProgress(0)
      onOpenChange(false)
    }
  }

  const formatTimeForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss")
  }

  const parseTimeFromInput = (value: string) => {
    return new Date(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Clip
          </DialogTitle>
          <DialogDescription>
            Exporte um trecho da gravação de {cameraName}
          </DialogDescription>
        </DialogHeader>

        {exportStatus === 'idle' && (
          <div className="space-y-4 py-4">
            {/* Tempo inicial */}
            <div className="space-y-2">
              <Label htmlFor="start-time">Início do clip</Label>
              <Input
                id="start-time"
                type="datetime-local"
                step="1"
                value={formatTimeForInput(clipStartTime)}
                onChange={(e) => setClipStartTime(parseTimeFromInput(e.target.value))}
              />
            </div>

            {/* Tempo final */}
            <div className="space-y-2">
              <Label htmlFor="end-time">Fim do clip</Label>
              <Input
                id="end-time"
                type="datetime-local"
                step="1"
                value={formatTimeForInput(clipEndTime)}
                onChange={(e) => setClipEndTime(parseTimeFromInput(e.target.value))}
              />
            </div>

            {/* Info de duração */}
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Duração: {durationMinutes}m {durationSecondsRemainder}s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span>~{estimatedSizeMB} MB</span>
              </div>
            </div>

            {/* Formato */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Formato</Label>
                <Select value={formatType} onValueChange={(v) => setFormatType(v as typeof formatType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="avi">AVI</SelectItem>
                    <SelectItem value="mkv">MKV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Qualidade</Label>
                <Select value={quality} onValueChange={(v) => setQuality(v as typeof quality)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="high">Alta (1080p)</SelectItem>
                    <SelectItem value="medium">Média (720p)</SelectItem>
                    <SelectItem value="low">Baixa (480p)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {exportStatus === 'exporting' && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
            <div className="space-y-2">
              <Progress value={exportProgress} />
              <p className="text-center text-sm text-muted-foreground">
                Exportando clip... {exportProgress}%
              </p>
            </div>
          </div>
        )}

        {exportStatus === 'success' && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="text-center">
              <p className="font-medium">Exportação concluída!</p>
              <p className="text-sm text-muted-foreground mt-1">
                O arquivo está pronto para download
              </p>
            </div>
            <div className="flex justify-center">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Baixar arquivo
              </Button>
            </div>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-red-600">Erro na exportação</p>
              <p className="text-sm text-muted-foreground mt-1">
                Não foi possível exportar o clip. Tente novamente.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {exportStatus === 'idle' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleExport} disabled={durationSeconds <= 0}>
                <Film className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </>
          )}
          {(exportStatus === 'success' || exportStatus === 'error') && (
            <Button variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
