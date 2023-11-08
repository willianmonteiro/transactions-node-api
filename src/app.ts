import fastify from 'fastify';
import cookies from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { transactionRoutes } from './routes/transactions';

export const app = fastify();

const swaggerOptions = {
	routePrefix: '/documentation',
	swagger: {
		info: {
			title: 'Transactions Node API',
			description: 'A sample API with Node, Fastify and Swagger',
			version: '1.0.0',
		},
	},
	exposeRoute: true,
};

app
	.register(cookies)
	.register(swagger)
	.register(swaggerUI, swaggerOptions)
	.register(transactionRoutes, { prefix: 'transactions' });