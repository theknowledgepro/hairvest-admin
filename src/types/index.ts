export type BaseAPIResponse = { message: string; status: string; time: string };
export interface PaginatedResult<T> {
	totalCount: number;
	totalPages: number;
	currentPage: number;
	fetchLimit: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	results: T[];
}

export interface User {
	id: string;
	email: string;
	avatar: string;
	memberRole: string;
	businessId?: string;
	firstName: string;
	lastName: string;
	phone: {
		international: string;
		national: string;
	};
	gender: string;
}

export interface ImageType {
	key: string;
	thumbnail: string;
	preview: string;
	minified: string;
	original: string;
}

export type VideoType = {
	key: string;
	duration: number;
	masterPlaylist: string; // key on S3
	variants: {
		resolution: string;
		bitrate: string;
		playlist: string; // key on S3
	}[];
	thumbnails: {
		preview: string;
		sprite: string;
		vtt: string;
	};
};
