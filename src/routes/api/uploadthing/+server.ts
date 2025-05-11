import { env } from '$env/dynamic/private';
import { webFileRouter } from '$lib/server/uploadthing';

import { createRouteHandler } from 'uploadthing/server';

console.log(env.UPLOADTHING_TOKEN);

const handlers = createRouteHandler({
	router: webFileRouter,
	config: {
		token: env.UPLOADTHING_TOKEN
	}
});

export { handlers as GET, handlers as POST };
