import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteSchema, defaultSiteValues } from '@/schemas/site.schema';
import type { SiteFormData } from '@/schemas/site.schema';
import { useCreateSite, useUpdateSite, useAddressByZipCode } from '@/hooks/useSites';
import { LoadingButton } from '@/components/form/LoadingButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SiteFormProps {
  initialData?: SiteFormData & { id: string };
  onSuccess: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const SiteForm: React.FC<SiteFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isEditing = false
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: initialData || defaultSiteValues
  });

  const createMutation = useCreateSite();
  const updateMutation = useUpdateSite();
  const addressMutation = useAddressByZipCode();

  const zipCode = watch('zipCode');

  const handleFetchAddress = async () => {
    if (!zipCode) return;
    try {
      const data = await addressMutation.mutateAsync(zipCode);
      setValue('street', data.street);
      setValue('neighborhood', data.neighborhood);
      setValue('city', data.city);
      setValue('state', data.state);
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    }
  };

  const onSubmit = async (data: SiteFormData) => {
    try {
      // Transformar dados planos em DTO
      const dtoData = {
        name: data.name,
        description: data.description,
        type: data.type as any, // Type from enum
        tenantId: data.tenantId,
        address: {
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
        },
        contact: {
          manager: data.contactName || '',
          phone: data.contactPhone || '',
          email: data.contactEmail || '',
        },
      };

      if (isEditing && initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: dtoData as any
        });
      } else {
        await createMutation.mutateAsync(dtoData as any);
      }
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar local:', error);
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
                Nome do Local <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: Matriz São Paulo"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('name')}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Local <span className="text-red-600">*</span>
              </label>
              <select
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('type')}
              >
                <option value="">Selecione um tipo</option>
                {['HEADQUARTERS', 'BRANCH', 'STORE', 'WAREHOUSE', 'OFFICE', 'FACTORY', 'DATACENTER', 'OTHER'].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              placeholder="Descrição do local (opcional)"
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

        {/* Endereço */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CEP <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="00000-000"
                  className={`flex-1 px-3 py-2 border rounded-md ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('zipCode')}
                />
                <button
                  type="button"
                  onClick={handleFetchAddress}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={addressMutation.isPending}
                >
                  {addressMutation.isPending ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rua <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: Rua das Flores"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.street ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('street')}
              />
              {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Número <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: 123"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('number')}
              />
              {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Complemento</label>
              <input
                type="text"
                placeholder="ex: Apto 101"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.complement ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('complement')}
              />
              {errors.complement && (
                <p className="mt-1 text-sm text-red-600">{errors.complement.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bairro <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: Centro"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.neighborhood ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('neighborhood')}
              />
              {errors.neighborhood && (
                <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cidade <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: São Paulo"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('city')}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="ex: SP"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('state')}
                maxLength={2}
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">País</label>
              <input
                type="text"
                placeholder="ex: Brasil"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('country')}
              />
              {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
            </div>
          </div>
        </div>

        {/* Contato */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Contato</label>
              <input
                type="text"
                placeholder="ex: João Silva"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.contactName ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('contactName')}
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('contactPhone')}
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="ex: contato@empresa.com"
              className={`mt-1 w-full px-3 py-2 border rounded-md ${
                errors.contactEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('contactEmail')}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-6 border-t">
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            variant="default"
          >
            {isEditing ? 'Atualizar' : 'Criar'} Local
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
