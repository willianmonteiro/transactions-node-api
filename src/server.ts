import { app } from './app';
import { env } from './env';

app
	.listen({ 
		port: env.PORT,
		host: ('RENDER' in env) ? '0.0.0.0' : 'localhost',
	})
	.then(() => {
		console.log(`HTTP server running at ${env.PORT}`);
	});