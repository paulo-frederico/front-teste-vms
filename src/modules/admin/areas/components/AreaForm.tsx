import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { areaSchema, defaultAreaValues } from '@/schemas/area.schema';
import type { AreaFormData } from '@/schemas/area.schema';
import { useCreateArea, useUpdateArea } from '@/hooks/useAreas';
import { useSites } from '@/hooks/useSites';
import { LoadingButton } from '@/components/form/LoadingButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AreaType } from '@/modules/shared/types/area';

interface AreaFormProps {
  siteId?: string;
  initialData?: AreaFormData & { id: string };
  onSuccess: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const AreaForm: React.FC<AreaFormProps> = ({
  siteId,
  initialData,
  onSuccess,
  onCancel,
  isEditing = false
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      ...defaultAreaValues,
      siteId: siteId || initialData?.siteId,
    }
  });

  const createMutation = useCreateArea();
  const updateMutation = useUpdateArea();
  const { data: sites = [] } = useSites();

  const onSubmit = async (data: AreaFormData) => {
    try {
      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar área:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Área <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: Recepção Principal"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('name')}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Área <span className="text-red-600">*</span>
              </label>
              <select
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('type')}
              >
                <option value="">Selecione um tipo</option>
                {Object.values(AreaType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>
          </div>

          {!siteId && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Local <span className="text-red-600">*</span>
              </label>
              <select
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.siteId ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('siteId')}
              >
                <option value="">Selecione um local</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
              {errors.siteId && <p className="mt-1 text-sm text-red-600">{errors.siteId.message}</p>}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              placeholder="Descrição da área (opcional)"
              rows={3}
              className={`mt-1 w-full px-3 py-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Detalhes Adicionais */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Andar</label>
              <input
                type="text"
                placeholder="ex: 2º andar"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.floor ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('floor')}
              />
              {errors.floor && <p className="mt-1 text-sm text-red-600">{errors.floor.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Capacidade (pessoas)</label>
              <input
                type="number"
                placeholder="ex: 50"
                min="1"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('capacity', { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
              <input
                type="number"
                placeholder="ex: 100"
                min="1"
                step="0.01"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.squareMeters ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('squareMeters', { valueAsNumber: true })}
              />
              {errors.squareMeters && (
                <p className="mt-1 text-sm text-red-600">{errors.squareMeters.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-6 border-t">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            variant="default"
          >
            {isEditing ? 'Atualizar' : 'Criar'} Área
          </LoadingButton>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
