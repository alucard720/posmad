export const ROLES ={
    ADMIN : "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    USER : "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    PROP: "propietario",
    CAJERO:"cajero",
    SUPER:"superuser"
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


export const ROLE_PERMISSIONS: Record<string, string[]> = {
    ADMINISTRADOR: ["view_dashboard", "view_products", "edit_products", "delete_products", "view_users", "edit_users", "delete_users", "view_roles", "edit_roles", "delete_roles", "view_permissions", "edit_permissions", "delete_permissions", "view_orders", "edit_orders", "delete_orders", "view_customers", "edit_customers", "delete_customers", "view_sales", "edit_sales", "delete_sales", "view_purchases", "edit_purchases", "delete_purchases", "view_reports", "edit_reports", "delete_reports", "view_settings", "edit_settings", "delete_settings"],
    CAJERO: ["view_dashboard", "view_products"],
    // PROP: ["view_dashboard", "view_products", "edit_products", "delete_products", "view_users", "edit_users", "delete_users", "view_roles", "edit_roles", "delete_roles", "view_permissions", "edit_permissions", "delete_permissions", "view_orders", "edit_orders", "delete_orders", "view_customers", "edit_customers", "delete_customers", "view_sales", "edit_sales", "delete_sales", "view_purchases", "edit_purchases", "delete_purchases", "view_reports", "edit_reports", "delete_reports", "view_settings", "edit_settings", "delete_settings"],
};