import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AreaForm } from '../components/AreaForm';

export const AreaEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSuccess = () => {
    if (id) {
      navigate(`/admin/areas/${id}`);
    } else {
      navigate('/admin/areas');
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/admin/areas/${id}`);
    } else {
      navigate('/admin/areas');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Área</h1>
        <p className="mt-1 text-gray-500">
          Modifique os campos abaixo para atualizar a área.
        </p>
      </div>

      {id && <AreaForm onSuccess={handleSuccess} onCancel={handleCancel} isEditing />}
    </div>
  );
};
