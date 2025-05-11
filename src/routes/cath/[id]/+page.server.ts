import { error } from '@sveltejs/kit';
import { cathegories } from '../../cathegories';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const cathegory = cathegories.find((c) => c.id === params.id);

	if (!cathegory) {
		throw error(404, 'Cathegory not found');
	}
	cookies.set('currentCathegory', cathegory.id.toString(), {
		path: '/'
	});

	const userId = cookies.get('user');
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const shot = await prisma.shot.findFirst({
		where: {
			userId: userId,
			cathegoryId: Number.parseInt(cathegory.id)
		}
	});

	const hasShot = shot ? true : false;

	return {
		cathegory,
		hasShot
	};
};
