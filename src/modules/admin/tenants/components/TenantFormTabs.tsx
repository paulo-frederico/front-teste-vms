import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TenantFormData } from '@/schemas/tenant.schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from '@/components/form/FormField';
import { MaskedInput } from '@/components/form/MaskedInput';

interface TenantFormTabsProps {
  form: UseFormReturn<TenantFormData>;
}

export const TenantFormTabs: React.FC<TenantFormTabsProps> = ({ form }) => {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
        <TabsTrigger value="contato">Contato</TabsTrigger>
        <TabsTrigger value="limites">Limites</TabsTrigger>
      </TabsList>

      {/* ABA GERAL */}
      <TabsContent value="geral" className="space-y-4">
        <FormField
          label="Nome do Cliente"
          name="name"
          error={errors.name}
          required
        >
          <Input
            {...register('name')}
            placeholder="Ex: Empresa ABC Ltda"
          />
        </FormField>

        <FormField
          label="Plano"
          name="plan"
          error={errors.plan}
          required
        >
          <Select
            value={watch('plan')}
            onValueChange={(value) => setValue('plan', value as unknown)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o plano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BASIC">Básico</SelectItem>
              <SelectItem value="PROFESSIONAL">Profissional</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Data de Contrato"
            name="contractDate"
            error={errors.contractDate}
            required
          >
            <Input
              type="date"
              {...register('contractDate')}
            />
          </FormField>

          <FormField
            label="Data de Expiração"
            name="expirationDate"
            error={errors.expirationDate}
            required
          >
            <Input
              type="date"
              {...register('expirationDate')}
            />
          </FormField>
        </div>
      </TabsContent>

      {/* ABA DADOS FISCAIS */}
      <TabsContent value="fiscal" className="space-y-4">
        <FormField
          label="CNPJ"
          name="fiscalData.cnpj"
          error={errors.fiscalData?.cnpj}
          required
        >
          <MaskedInput
            mask="99.999.999/9999-99"
            value={watch('fiscalData.cnpj') || ''}
            onChange={(e) => setValue('fiscalData.cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
          />
        </FormField>

        <FormField
          label="Razão Social"
          name="fiscalData.companyName"
          error={errors.fiscalData?.companyName}
          required
        >
          <Input
            {...register('fiscalData.companyName')}
            placeholder="Ex: Empresa ABC Ltda"
          />
        </FormField>

        <FormField
          label="Inscrição Estadual"
          name="fiscalData.stateRegistration"
          error={errors.fiscalData?.stateRegistration}
        >
          <Input
            {...register('fiscalData.stateRegistration')}
            placeholder="Opcional"
          />
        </FormField>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Endereço</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="CEP"
              name="fiscalData.address.zipCode"
              error={errors.fiscalData?.address?.zipCode}
              required
            >
              <MaskedInput
                mask="99999-999"
                value={watch('fiscalData.address.zipCode') || ''}
                onChange={(e) => setValue('fiscalData.address.zipCode', e.target.value)}
                placeholder="00000-000"
              />
            </FormField>

            <FormField
              label="Estado"
              name="fiscalData.address.state"
              error={errors.fiscalData?.address?.state}
              required
            >
              <Input
                {...register('fiscalData.address.state')}
                placeholder="SP"
                maxLength={2}
              />
            </FormField>
          </div>

          <FormField
            label="Rua"
            name="fiscalData.address.street"
            error={errors.fiscalData?.address?.street}
            required
          >
            <Input
              {...register('fiscalData.address.street')}
              placeholder="Ex: Rua das Flores"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Número"
              name="fiscalData.address.number"
              error={errors.fiscalData?.address?.number}
              required
            >
              <Input
                {...register('fiscalData.address.number')}
                placeholder="123"
              />
            </FormField>

            <FormField
              label="Complemento"
              name="fiscalData.address.complement"
              error={errors.fiscalData?.address?.complement}
            >
              <Input
                {...register('fiscalData.address.complement')}
                placeholder="Opcional"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Bairro"
              name="fiscalData.address.neighborhood"
              error={errors.fiscalData?.address?.neighborhood}
              required
            >
              <Input
                {...register('fiscalData.address.neighborhood')}
                placeholder="Ex: Centro"
              />
            </FormField>

            <FormField
              label="Cidade"
              name="fiscalData.address.city"
              error={errors.fiscalData?.address?.city}
              required
            >
              <Input
                {...register('fiscalData.address.city')}
                placeholder="Ex: São Paulo"
              />
            </FormField>
          </div>
        </div>
      </TabsContent>

      {/* ABA CONTATO */}
      <TabsContent value="contato" className="space-y-4">
        <FormField
          label="Nome do Contato"
          name="primaryContact.name"
          error={errors.primaryContact?.name}
          required
        >
          <Input
            {...register('primaryContact.name')}
            placeholder="Ex: João Silva"
          />
        </FormField>

        <FormField
          label="Email"
          name="primaryContact.email"
          error={errors.primaryContact?.email}
          required
        >
          <Input
            type="email"
            {...register('primaryContact.email')}
            placeholder="contato@empresa.com"
          />
        </FormField>

        <FormField
          label="Telefone"
          name="primaryContact.phone"
          error={errors.primaryContact?.phone}
          required
        >
          <MaskedInput
            mask="(99) 99999-9999"
            value={watch('primaryContact.phone') || ''}
            onChange={(e) => setValue('primaryContact.phone', e.target.value)}
            placeholder="(11) 98765-4321"
          />
        </FormField>

        <FormField
          label="Cargo"
          name="primaryContact.position"
          error={errors.primaryContact?.position}
        >
          <Input
            {...register('primaryContact.position')}
            placeholder="Ex: Diretor de TI"
          />
        </FormField>
      </TabsContent>

      {/* ABA LIMITES */}
      <TabsContent value="limites" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Máximo de Câmeras"
            name="limits.maxCameras"
            error={errors.limits?.maxCameras}
            required
          >
            <Input
              type="number"
              {...register('limits.maxCameras', { valueAsNumber: true })}
              min={1}
              max={1000}
            />
          </FormField>

          <FormField
            label="Máximo de Sites"
            name="limits.maxSites"
            error={errors.limits?.maxSites}
            required
          >
            <Input
              type="number"
              {...register('limits.maxSites', { valueAsNumber: true })}
              min={1}
              max={100}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Máximo de Usuários"
            name="limits.maxUsers"
            error={errors.limits?.maxUsers}
            required
          >
            <Input
              type="number"
              {...register('limits.maxUsers', { valueAsNumber: true })}
              min={1}
              max={500}
            />
          </FormField>

          <FormField
            label="Retenção (dias)"
            name="limits.retentionDays"
            error={errors.limits?.retentionDays}
            required
          >
            <Input
              type="number"
              {...register('limits.retentionDays', { valueAsNumber: true })}
              min={1}
              max={365}
            />
          </FormField>
        </div>

        <FormField
          label="Storage (GB)"
          name="limits.storageGB"
          error={errors.limits?.storageGB}
          required
        >
          <Input
            type="number"
            {...register('limits.storageGB', { valueAsNumber: true })}
            min={10}
            max={10000}
          />
        </FormField>

        <FormField
          label="Qualidade Máxima de Stream"
          name="limits.maxStreamQuality"
          error={errors.limits?.maxStreamQuality}
          required
        >
          <Select
            value={watch('limits.maxStreamQuality')}
            onValueChange={(value) => setValue('limits.maxStreamQuality', value as unknown)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SD">SD (480p)</SelectItem>
              <SelectItem value="HD">HD (720p)</SelectItem>
              <SelectItem value="FULLHD">Full HD (1080p)</SelectItem>
              <SelectItem value="4K">4K (2160p)</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </TabsContent>
    </Tabs>
  );
};
