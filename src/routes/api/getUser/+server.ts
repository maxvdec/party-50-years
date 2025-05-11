import { prisma, type User } from '$lib/server';
import { json, type RequestHandler } from '@sveltejs/kit';
import { serialize } from 'cookie';

export const GET: RequestHandler = async ({ cookies }) => {
	const userId = cookies.get('user');
	try {
		let user: User | null = null;
		const headers = new Headers();
		if (!userId) {
			const newUserPrisma = await prisma.user.create({
				data: {
					shots: {
						create: []
					}
				}
			});
			user = {
				id: newUserPrisma.id,
				shots: [],
				completed: 0
			};

			const cookie = serialize('user', user.id, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				maxAge: 60 * 60 * 24 * 30
			});
			headers.append('Set-Cookie', cookie);
		} else {
			const userPrisma = await prisma.user.findUnique({
				where: {
					id: userId
				},
				include: {
					shots: true
				}
			});

			if (!userPrisma) {
				console.error('User not found');
				return json({ error: 'User not found' }, { status: 404 });
			}

			const shots = userPrisma!.shots!.map((shot: { id: string; cathegoryId: number }) => ({
				id: shot.id,
				cathegory: shot.cathegoryId
			}));

			user = {
				id: userPrisma.id,
				shots,
				completed: shots.length
			};
		}
		return json(user, { headers });
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to get user' }, { status: 500 });
	}
};
