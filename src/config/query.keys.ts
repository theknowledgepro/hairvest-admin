export const queryKeys = {
	login: ['auth', 'login'],
	refresh: ['auth', 'refresh'],

	staffRoles: ['staff', 'roles'],
	staffMembers: ['staff', 'members'],
	staffPermissions: ['staff', 'permissions'],

	productCategories: ['product-categories'],
	products: ['products'],

	customers: ['customers'],
	customerDetails: (id: string) => ['customerDetails', id],

	reviews: ['reviews'],
	orders: ['orders'],
	installments: ['installments'],
	cartInsights: ['cart-insights'],
	wishlistInsights: ['wishlist-insights'],
	customerRequests: ['customer-requests'],
	customerRequestDetails: (id: string) => ['customerRequestDetails', id],
};
