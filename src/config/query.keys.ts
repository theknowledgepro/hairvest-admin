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
};
