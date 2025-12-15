import React, { useEffect, useState } from 'react';
import { useCameraAccessSession, useEndCameraAccess } from '@/hooks/useCameraAccess';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Clock, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface CameraAccessBannerProps {
  cameraId: string;
}

export const CameraAccessBanner: React.FC<CameraAccessBannerProps> = ({ cameraId }) => {
  const { data: session, isLoading } = useCameraAccessSession(cameraId);
  const endAccessMutation = useEndCameraAccess();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!session || !session.active) return;

    const interval = setInterval(() => {
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      const remainingMs = expiresAt.getTime() - now.getTime();

      if (remainingMs <= 0) {
        // Sessão expirou
        clearInterval(interval);
        toast.warning('Acesso encerrado automaticamente (tempo limite de 30 minutos)');
        window.location.reload(); // Recarregar página
        return;
      }

      // Calcular tempo restante
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);

      // Aviso 5 minutos antes de expirar
      if (minutes === 4 && seconds === 59 && !showWarning) {
        setShowWarning(true);
        toast.warning('⚠️ Acesso expira em 5 minutos! Salve seu trabalho.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, showWarning]);

  const handleEndAccess = async () => {
    if (window.confirm('Tem certeza que deseja encerrar o acesso a esta câmera?')) {
      await endAccessMutation.mutateAsync(cameraId);
      window.location.reload();
    }
  };

  if (isLoading || !session || !session.active) return null;

  return (
    <Alert 
      variant="warning" 
      className="sticky top-0 z-50 bg-yellow-50 border-yellow-400 shadow-lg"
    >
      <ShieldAlert className="h-5 w-5 text-yellow-600" />
      <AlertTitle className="text-yellow-900 font-semibold flex items-center gap-2">
        🔒 Acesso LGPD Ativo
        {showWarning && (
          <span className="animate-pulse text-red-600">
            ⚠️ EXPIRA EM {timeRemaining}
          </span>
        )}
      </AlertTitle>
      <AlertDescription className="text-yellow-800 text-sm mt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p>
              <strong>Cliente:</strong> {session.tenantName} | 
              <strong> Câmera:</strong> {session.cameraName}
            </p>
            <p>
              <strong>Motivo:</strong> {session.reasonLabel} | 
              <strong> Tempo de acesso:</strong> {Math.floor(session.durationSeconds / 60)} min {session.durationSeconds % 60} seg
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <strong>Expira em:</strong> {timeRemaining} ({new Date(session.expiresAt).toLocaleTimeString('pt-BR')})
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleEndAccess}
            disabled={endAccessMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Encerrar Acesso
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
