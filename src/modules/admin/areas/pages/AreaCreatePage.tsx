import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AreaForm } from '../components/AreaForm';

export const AreaCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const siteId = searchParams.get('siteId');

  const handleSuccess = () => {
    navigate('/admin/sites');
  };

  const handleCancel = () => {
    navigate('/admin/sites');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Criar Nova Área</h1>
        <p className="mt-1 text-gray-500">
          Preencha os campos abaixo para criar uma nova área.
        </p>
      </div>

      <AreaForm siteId={siteId || undefined} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};
