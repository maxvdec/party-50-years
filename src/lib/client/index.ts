export type Shot = {
	id: string;
	cathegoryId: number;
	imageUrl: string;
	userId: string;
};

export type User = {
	id: string;
	shots: Shot[];
};
