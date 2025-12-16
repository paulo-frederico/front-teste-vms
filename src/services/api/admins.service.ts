/**
 * Serviço de Admins (subordinados do Admin Master)
 */

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  createdBy: string;
  createdByName: string;
}

export interface CreateAdminDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateAdminDTO {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface AdminFilters {
  status?: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminListResponse {
  admins: Admin[];
  total: number;
  page: number;
  totalPages: number;
}

// Mock data
const MOCK_ADMINS: Admin[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@unifique.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    phone: '(11) 98765-4321',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T15:30:00Z',
    lastLogin: '2024-12-12T09:15:00Z',
    createdBy: '1',
    createdByName: 'Admin Master'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@unifique.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    phone: '(21) 99999-8888',
    createdAt: '2024-03-20T14:00:00Z',
    updatedAt: '2024-11-28T11:20:00Z',
    lastLogin: '2024-12-11T16:45:00Z',
    createdBy: '1',
    createdByName: 'Admin Master'
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@unifique.com',
    role: 'ADMIN',
    status: 'SUSPENDED',
    phone: '(31) 3333-4444',
    createdAt: '2024-06-10T08:00:00Z',
    updatedAt: '2024-12-05T10:00:00Z',
    lastLogin: '2024-12-03T14:30:00Z',
    createdBy: '1',
    createdByName: 'Admin Master'
  }
];

class AdminsService {
  async list(filters?: AdminFilters): Promise<AdminListResponse> {
    console.log('📋 [AdminsService] Carregando lista de admins (FIXTURES)');
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredAdmins = [...MOCK_ADMINS];

    if (filters?.status) {
      filteredAdmins = filteredAdmins.filter(a => a.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredAdmins = filteredAdmins.filter(a => 
        a.name.toLowerCase().includes(searchLower) ||
        a.email.toLowerCase().includes(searchLower)
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

    return {
      admins: paginatedAdmins,
      total: filteredAdmins.length,
      page: page,
      totalPages: Math.ceil(filteredAdmins.length / limit)
    };
  }

  async getById(id: string): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const admin = MOCK_ADMINS.find(a => a.id === id);
    if (!admin) throw new Error(`Admin ${id} não encontrado`);
    return admin;
  }

  async create(data: CreateAdminDTO): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: data.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1',
      createdByName: 'Admin Master'
    };
  }

  async update(id: string, data: UpdateAdminDTO): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const admin = MOCK_ADMINS.find(a => a.id === id);
    if (!admin) throw new Error(`Admin ${id} não encontrado`);
    return { ...admin, ...data, updatedAt: new Date().toISOString() };
  }

  async changeStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'): Promise<Admin> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const admin = MOCK_ADMINS.find(a => a.id === id);
    if (!admin) throw new Error(`Admin ${id} não encontrado`);
    return { ...admin, status, updatedAt: new Date().toISOString() };
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`✅ [AdminsService] Admin ${id} removido (simulado)`);
  }

  async resetPassword(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`✅ [AdminsService] Senha para admin ${id} resetada (simulado)`);
  }
}

export const adminsService = new AdminsService();
