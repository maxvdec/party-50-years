import { json, type RequestHandler } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';
import { prisma } from '$lib/server';

cloudinary.config({
	cloud_name: env.CLOUDINARY_NAME,
	api_key: env.CLOUDINARY_KEY,
	api_secret: env.CLOUDINARY_SECRET
});

export const POST: RequestHandler = async ({ request }) => {
	const { imageUrl, userId, cathegoryId } = await request.json();

	const uploadResult = await cloudinary.uploader
		.upload(imageUrl, {
			public_id: userId + '-' + cathegoryId + '-' + new Date().getTime().toString()
		})
		.catch((error) => {
			console.error('Error uploading image to cloudinary: ', error);
			throw new Error('Failed to upload image');
		});

	if (!uploadResult?.url) {
		throw new Error('Failed to get image URL');
	}

	const url = uploadResult.url;

	const user = prisma.user.findUnique({
		where: {
			id: userId
		}
	});
	if (!user) throw new Error('User not found');

	await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			shots: {
				create: {
					imageUrl: url,
					cathegoryId: parseInt(cathegoryId)
				}
			}
		}
	});

	return json({ status: 200 });
};
