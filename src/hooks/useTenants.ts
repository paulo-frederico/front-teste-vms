import { useQuery } from '@tanstack/react-query';

interface Tenant {
  id: string;
  name: string;
}

const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'Empresa ABC Ltda' },
  { id: '2', name: 'Tech Solutions Inc' },
  { id: '3', name: 'Global Corp' }
];

export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_TENANTS;
    },
    staleTime: 30000
  });
};
