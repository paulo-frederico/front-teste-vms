import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  cameraAccessRequestSchema, 
  type CameraAccessRequestFormData,
  defaultCameraAccessRequestValues
} from '@/schemas/camera-access.schema';
import { AccessReason } from '@/modules/shared/types/camera-access';
import { useRequestCameraAccess } from '@/hooks/useCameraAccess';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { LoadingButton } from '@/components/form/LoadingButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface CameraAccessRequestModalProps {
  open: boolean;
  onClose: () => void;
  camera: {
    id: string;
    name: string;
    tenantId: string;
    tenantName: string;
  };
  onAccessGranted: () => void;
}

export const CameraAccessRequestModal: React.FC<CameraAccessRequestModalProps> = ({
  open,
  onClose,
  camera,
  onAccessGranted
}) => {
  const requestAccessMutation = useRequestCameraAccess();

  const form = useForm<CameraAccessRequestFormData>({
    resolver: zodResolver(cameraAccessRequestSchema),
    defaultValues: {
      ...defaultCameraAccessRequestValues,
      cameraId: camera.id
    }
  });

  const { register, formState: { errors }, watch, setValue, handleSubmit, reset } = form;

  const onSubmit = async (data: CameraAccessRequestFormData) => {
    try {
      await requestAccessMutation.mutateAsync({
        cameraId: camera.id,
        cameraName: camera.name,
        tenantId: camera.tenantId,
        tenantName: camera.tenantName,
        reason: data.reason as AccessReason,
        description: data.description,
        ticketNumber: data.ticketNumber
      });
      reset();
      onAccessGranted();
      onClose();
    } catch (error) {
      console.error('Erro ao solicitar acesso:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="w-6 h-6 text-yellow-600" />
            Acesso a Imagens de Cliente (LGPD)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Banner de Aviso LGPD */}
          <Alert variant="warning" className="bg-yellow-50 border-yellow-300">
            <AlertTitle className="text-yellow-900 font-semibold">
              ⚠️ Acesso Temporário e Auditado
            </AlertTitle>
            <AlertDescription className="text-yellow-800 text-sm mt-2 space-y-2">
              <p>
                Você está prestes a acessar imagens de câmeras do cliente{' '}
                <strong>{camera.tenantName}</strong>.
              </p>
              <p>
                Este acesso será <strong>registrado em log de auditoria</strong> conforme LGPD 
                (Lei 13.709/2018) e ficará disponível para consulta do cliente.
              </p>
              <p>
                <strong>Duração máxima:</strong> 30 minutos | 
                <strong> Desconexão automática</strong> ao expirar
              </p>
            </AlertDescription>
          </Alert>

          {/* Informações da Câmera */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Câmera Selecionada</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Nome:</span>
                <span className="font-medium text-gray-900 ml-2">{camera.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium text-gray-900 ml-2">{camera.tenantName}</span>
              </div>
            </div>
          </div>

          {/* Motivo do Acesso */}
          <FormField label="Motivo do Acesso" name="reason" error={errors.reason} required>
            <Select
              value={watch('reason') || 'TECHNICAL_SUPPORT'}
              onValueChange={(value) => setValue('reason', value as AccessReason)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECHNICAL_SUPPORT">
                  Suporte Técnico (troubleshooting)
                </SelectItem>
                <SelectItem value="INCIDENT_INVESTIGATION">
                  Investigação de Incidente de Segurança
                </SelectItem>
                <SelectItem value="CLIENT_REQUEST">
                  Solicitação do Cliente
                </SelectItem>
                <SelectItem value="COMPLIANCE_AUDIT">
                  Auditoria de Conformidade
                </SelectItem>
                <SelectItem value="INFRASTRUCTURE_MONITORING">
                  Monitoramento de Infraestrutura
                </SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Descrição Detalhada */}
          <FormField label="Descrição Detalhada" name="description" error={errors.description} required>
            <Textarea
              {...register('description')}
              placeholder="Ex: Cliente reportou câmera offline. Verificando conectividade, qualidade de stream e configurações de rede."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 20 caracteres. Seja específico sobre o que você irá fazer.
            </p>
          </FormField>

          {/* Ticket/Protocolo */}
          <FormField label="Ticket/Protocolo (opcional)" name="ticketNumber" error={errors.ticketNumber}>
            <Input
              {...register('ticketNumber')}
              placeholder="Ex: TICKET-12345, PROTOCOLO-67890"
            />
            <p className="text-xs text-gray-500 mt-1">
              Número do ticket de suporte ou protocolo de atendimento (se aplicável)
            </p>
          </FormField>

          {/* Resumo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Resumo do Acesso</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Acesso será registrado em log de auditoria</li>
              <li>✅ Cliente poderá consultar este acesso</li>
              <li>✅ Duração máxima: 30 minutos</li>
              <li>✅ Desconexão automática ao expirar</li>
              <li>✅ Apenas visualização ao vivo e snapshot</li>
              <li>❌ Sem acesso a gravações históricas</li>
            </ul>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <LoadingButton type="submit" isLoading={requestAccessMutation.isPending}>
              Confirmar e Acessar
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
