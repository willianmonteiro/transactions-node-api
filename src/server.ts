import fastify from 'fastify';
import { env } from './env';
import { transactionRoutes } from './routes/transactions';

const app = fastify();

app
	.register(transactionRoutes, { prefix: 'transactions' })
	.listen({ port: env.HTTP_PORT })
	.then(() => {
		console.log(`HTTP server running at ${env.HTTP_PORT}`);
	});