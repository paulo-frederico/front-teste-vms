import React from 'react';
import { IMaskInput } from 'react-imask';

interface MaskedInputProps {
  mask: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Converte máscara do formato "99.999.999/9999-99" para formato IMask "00.000.000/0000-00"
const convertMask = (mask: string): string => {
  return mask.replace(/9/g, '0');
};

export const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  value,
  onChange,
  placeholder,
  disabled,
  className
}) => {
  const imaskPattern = convertMask(mask);
  
  return (
    <IMaskInput
      mask={imaskPattern}
      value={value}
      unmask={false}
      onAccept={(maskedValue: string) => {
        // Simula evento de change do input nativo
        const syntheticEvent = {
          target: {
            value: maskedValue,
            name: ''
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }}
      placeholder={placeholder}
      disabled={disabled}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    />
  );
};
