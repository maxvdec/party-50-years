import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export type Shot = {
	id: string;
	cathegory: number;
};

export type User = {
	id: string;
	shots: Shot[];
	completed: number;
};
