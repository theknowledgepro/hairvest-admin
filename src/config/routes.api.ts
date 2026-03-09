export const API_ROUTES = {
	REFRESH: '/auth/refresh',
	LOGIN: '/auth/login',
	LOGOUT: '/auth/logout',
	SEND_PASSWORD_RESET_INSTRUCTIONS: '/auth/send-password-reset-instructions',
	VERIFY_PASSWORD_RESET_OTP: '/auth/verify-password-reset-otp',
	RESET_PASSWORD: '/auth/reset-password',

	STAFF_ROLES: '/staff/roles',
	STAFF_PERMISSIONS: '/staff/roles/permissions',
	STAFF_MEMBERS: '/staff/members',

	PRODUCT_CATEGORIES: '/products/categories',
	PRODUCTS: '/products',

	CUSTOMERS: '/customers',
	CUSTOMER_DETAILS: (id: string) => `/customers/${id}`,
};
