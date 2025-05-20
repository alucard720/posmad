
// export const UserRole = {
//     cajero : 0,
//     administrador : 1,
//     propietario : 2,
// }

export type UserRole = "administrador" | "cajero" | "propietario"
// export type UserRole = typeof UserRole[keyof typeof UserRole]

export interface User {
    id: string;
    email: string;
    fullname: string;
    password?: string;
    role: UserRole;
    enabled: boolean;
    createdAt: string;
    token?: string;
  }
  
  export interface UserResponse {
    status: string;
    message: string;
    data: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
      sortBy: string | null;
      order: string | null;
      records: User[];
    };
    error: string | null;
  }
  

  export interface Permissions {
    label: string;
    description: string;
    canManage: UserRole[];
    badge: string;
  }

  export type PaginationParams = {
    page?: number
    limit?: number
    sortBy?: string
    order?: "asc" | "desc"
    search?: string
  }
  
  // User creation parameters
  export type CreateUserParams = Omit<User, "id"> & {
    password: string
  }
  
  // User update parameters
  export type UpdateUserParams = Partial<User>