import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { CameraAccessLog } from '@/modules/shared/types/camera-access';

interface CameraAccessLogViewerProps {
  logs: CameraAccessLog[];
  isLoading?: boolean;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `há ${seconds}s`;
  if (seconds < 3600) return `há ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
  return `há ${Math.floor(seconds / 86400)}d`;
};

export const CameraAccessLogViewer: React.FC<CameraAccessLogViewerProps> = ({
  logs,
  isLoading = false
}) => {
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'VIEW_CAMERA_LIVE':
        return 'bg-blue-100 text-blue-800';
      case 'CAPTURE_SNAPSHOT':
        return 'bg-purple-100 text-purple-800';
      case 'END_ACCESS':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'VIEW_CAMERA_LIVE':
        return 'Visualização ao Vivo';
      case 'CAPTURE_SNAPSHOT':
        return 'Captura de Snapshot';
      case 'END_ACCESS':
        return 'Encerramento de Acesso';
      default:
        return action;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Nenhum acesso registrado para esta câmera
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-xs font-semibold">Data/Hora</TableHead>
            <TableHead className="text-xs font-semibold">Usuário</TableHead>
            <TableHead className="text-xs font-semibold">Ação</TableHead>
            <TableHead className="text-xs font-semibold">Motivo</TableHead>
            <TableHead className="text-xs font-semibold">Duração</TableHead>
            <TableHead className="text-xs font-semibold">IP</TableHead>
            <TableHead className="text-xs font-semibold">Ticket</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-gray-50">
              <TableCell className="text-sm">
                <div className="font-medium">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeAgo(log.timestamp)}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <div className="font-medium">{log.actorUserName}</div>
                <div className="text-xs text-gray-500">{log.actorRole}</div>
              </TableCell>
              <TableCell className="text-sm">
                <Badge className={getActionBadgeColor(log.action)}>
                  {getActionLabel(log.action)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                <div className="text-gray-900">{log.reasonLabel}</div>
                {log.description && (
                  <div className="text-xs text-gray-600 max-w-xs truncate">
                    {log.description}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {log.durationSeconds ? (
                  <div>
                    {Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm font-mono text-gray-600">
                {log.ipAddress}
              </TableCell>
              <TableCell className="text-sm">
                {log.ticketNumber ? (
                  <Badge variant="outline">{log.ticketNumber}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
