import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server';

export const GET: RequestHandler = async () => {
	const shots = await prisma.shot.findMany();
	return json(shots);
};
