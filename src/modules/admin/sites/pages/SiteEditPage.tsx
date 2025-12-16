import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SiteForm } from '../components/SiteForm';

export const SiteEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSuccess = () => {
    if (id) {
      navigate(`/admin/sites/${id}`);
    } else {
      navigate('/admin/sites');
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/admin/sites/${id}`);
    } else {
      navigate('/admin/sites');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Local</h1>
        <p className="mt-1 text-gray-500">
          Modifique os campos abaixo para atualizar o local.
        </p>
      </div>

      {id && <SiteForm onSuccess={handleSuccess} onCancel={handleCancel} isEditing />}
    </div>
  );
};
