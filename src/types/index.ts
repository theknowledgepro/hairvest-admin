export type BaseAPIResponse = { message: string; status: string; time: string };

export interface User {
	id: string;
	email: string;
	avatar: string;
	memberRole: string;
}
