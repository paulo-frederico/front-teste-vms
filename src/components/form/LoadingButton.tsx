import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  disabled,
  ...props
}) => {
  return (
    <Button {...props} disabled={isLoading || disabled}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Carregando...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
