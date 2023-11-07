import { app } from './app';
import { env } from './env';

app
	.listen({ port: env.HTTP_PORT })
	.then(() => {
		console.log(`HTTP server running at ${env.HTTP_PORT}`);
	});