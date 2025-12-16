import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  error?: { message?: string };
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  required,
  children
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error?.message && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};
