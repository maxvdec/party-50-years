import { createUploadthing } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';
import { prisma } from '.';

const f = createUploadthing();
const auth = (req: Request) => {
	const cookie = req.headers.get('cookie');
	let userId = cookie
		?.split('; ')
		.find((row) => row.startsWith('user='))
		?.split('=')[1];
	let currentCathegory = cookie
		?.split('; ')
		.find((row) => row.startsWith('currentCathegory='))
		?.split('=')[1];
	userId = userId?.trim();
	currentCathegory = currentCathegory?.trim();
	return { userId, currentCathegory };
};

export const webFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: '16MB',
			maxFileCount: 1
		}
	})
		.middleware(async ({ req }) => {
			const user = await auth(req);

			if (!user) throw new Error('Unauthorized');

			return { userId: user.userId, currentCathegory: user.currentCathegory };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete', metadata, file);
			const user = prisma.user.findUnique({
				where: {
					id: metadata.userId
				}
			});
			if (!user) throw new Error('User not found');

			await prisma.user.update({
				where: {
					id: metadata.userId
				},
				data: {
					shots: {
						create: {
							imageUrl: file.ufsUrl,
							cathegoryId: parseInt(metadata.currentCathegory!)
						}
					}
				}
			});
		})
} satisfies FileRouter;

export type WebFileRouter = typeof webFileRouter;
