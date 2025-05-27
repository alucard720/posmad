export const ROLES ={
    ADMIN: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    USER: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    CAJERO: "7c9e6679-7425-40de-944b-e07fc1f907c9",
    ALMACENISTA: "7c9e6679-7425-40de-944b-e07fc1f907ca",
    PROPIETARIO: "7c9e6679-7425-40de-944b-e07fc1f907cb",
};

export const PERMISSIONS = {
   VIEW_DASHBOARD: "view_dashboard",
   VIEW_PRODUCTS: "view_products",
   EDIT_PRODUCTS: "edit_products",
   DELETE_PRODUCTS: "delete_products",
   VIEW_USERS: "view_users",
   EDIT_USERS: "edit_users",
   DELETE_USERS: "delete_users",
   VIEW_ROLES: "view_roles",
   EDIT_ROLES: "edit_roles",
   DELETE_ROLES: "delete_roles",
   VIEW_PERMISSIONS: "view_permissions",
   EDIT_PERMISSIONS: "edit_permissions",
   DELETE_PERMISSIONS: "delete_permissions",
   VIEW_ORDERS: "view_orders",
   EDIT_ORDERS: "edit_orders",
   DELETE_ORDERS: "delete_orders",
   VIEW_CUSTOMERS: "view_customers",
   EDIT_CUSTOMERS: "edit_customers",
   DELETE_CUSTOMERS: "delete_customers",
   VIEW_SALES: "view_sales",
   EDIT_SALES: "edit_sales",
   DELETE_SALES: "delete_sales",
   VIEW_PURCHASES: "view_purchases",
   EDIT_PURCHASES: "edit_purchases",
   DELETE_PURCHASES: "delete_purchases",
   VIEW_REPORTS: "view_reports",
   EDIT_REPORTS: "edit_reports",
   DELETE_REPORTS: "delete_reports",
   VIEW_SETTINGS: "view_settings",
   EDIT_SETTINGS: "edit_settings",
   DELETE_SETTINGS: "delete_settings",
};


  export const roleDisplayNames: { [key: string]: string } = {
    [ROLES.ADMIN]: "Administrador",
    [ROLES.CAJERO]: "Cajero",
    [ROLES.USER]: "Usuario",
    [ROLES.PROPIETARIO]: "Propietario",
    [ROLES.ALMACENISTA]: "Almacenista",
  };
  
  export const rolePermissions: {
    [key: string]: {
      label: string;
      description: string;
      badge: string;
      canManage: string[];
    };
  } = {
    [ROLES.ADMIN]: {
      label: "Administrador",
      description: "Acceso completo al sistema, puede gestionar todos los usuarios excepto Propietarios.",
      badge: "bg-primary",
      canManage: [ROLES.ADMIN, ROLES.CAJERO, ROLES.USER, ROLES.ALMACENISTA],
    },
    [ROLES.CAJERO]: {
      label: "Cajero",
      description: "Gestiona transacciones y ventas, con acceso limitado al sistema.",
      badge: "bg-info",
      canManage: [],
    },
    [ROLES.USER]: {
      label: "Usuario",
      description: "Usuario estándar con acceso básico al sistema.",
      badge: "bg-secondary",
      canManage: [],
    },
    [ROLES.PROPIETARIO]: {
      label: "Propietario",
      description: "Control total del sistema, puede gestionar todos los usuarios y configuraciones.",
      badge: "bg-danger",
      canManage: [ROLES.ADMIN, ROLES.CAJERO, ROLES.USER, ROLES.ALMACENISTA, ROLES.PROPIETARIO],
    },
    [ROLES.ALMACENISTA]: {
      label: "Almacenista",
      description: "Gestiona inventarios y almacenes, con acceso limitado.",
      badge: "bg-warning",
      canManage: [],
    },
  };