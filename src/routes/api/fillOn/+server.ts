import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server';
import { cathegories } from '../../cathegories';

export const GET: RequestHandler = async ({ request }) => {
	try {
		// Get userId from cookie
		const cookie = request.headers.get('cookie');
		const userId = cookie
			?.split('; ')
			.find((row) => row.startsWith('user='))
			?.split('=')[1]
			?.trim();

		if (!userId) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { shots: true }
		});

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		const userShotCathegoryIds = user.shots.map((shot) => shot.cathegoryId);
		const missingCathegories = cathegories.filter(
			(cathegory) => !userShotCathegoryIds.includes(parseInt(cathegory.id))
		);

		if (missingCathegories.length > 0) {
			await prisma.user.update({
				where: { id: userId },
				data: {
					shots: {
						createMany: {
							data: missingCathegories.map((cathegory) => ({
								imageUrl: '',
								cathegoryId: parseInt(cathegory.id)
							}))
						}
					}
				}
			});
		}

		return json({
			status: 200,
			message: `Created ${missingCathegories.length} empty shots for user`
		});
	} catch (error) {
		console.error('Error filling empty shots:', error);
		return json({ error: 'Failed to fill empty shots' }, { status: 500 });
	}
};
