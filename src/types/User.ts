

export type User = {
  id: string;
  email: string;
  fullname: string;
  password?: string;
  role?: string;
  enabled: boolean;
  createdAt: string;
  token?: string;
  permissions?: string[];
  accessToken?: string;
}

// export interface PaginationResponse {
//   total: number;
//   totalPages: number;
//   page: number;
//   limit: number;
//   sortBy: string | null;
//   order: string | null;
//   records: User[];
// }

// export interface ErrorResponse {
//   error: string | null;
// }

// export interface Permissions {
//   label: string;
//   description: string;
//   canManage: string[];
//   badge: string;
// }

// export type PaginationParams = {
//   page?: number;
//   limit?: number;
//   sortBy?: string;
//   order?: "asc" | "desc";
//   search?: string;
// }

// User creation parameters
// export type CreateUserParams = Omit<User, "id"> & {
//   password: string
// }

// User update parameters
// export type UpdateUserParams = Partial<User>