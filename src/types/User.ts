export interface Role {
  id: number;
  fullname: string;
  permissions: string[];
}

export const roles: Role[] = [
  { id: 1, fullname: 'cajero', permissions: [] },
  { id: 2, fullname: 'administrador', permissions: [] },
  { id: 3, fullname: 'propietario', permissions: [] }
]

// export type RoleName = 'propietario' | 'administrador' | 'cajero'

export interface User {
  id: string;
  email: string;
  fullname: string;
  password?: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
  token?: string;
}

export interface PaginationResponse {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  sortBy: string | null;
  order: string | null;
  records: User[];
}

export interface ErrorResponse {
  error: string | null;
}

export interface Permissions {
  label: string;
  description: string;
  canManage: Role[];
  badge: string;
}

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

// User creation parameters
export type CreateUserParams = Omit<User, "id"> & {
  password: string
}

// User update parameters
export type UpdateUserParams = Partial<User>