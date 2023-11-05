import fastify from 'fastify';
import { knex } from './database';
import { env } from './env';
// import crypto from 'node:crypto';

const app = fastify();

app.get('/transactions', async () => {
	const transaction = await knex('transactions')
		.select('*');
	return transaction;
});

// app.get('/transaction', async () => {
// 	const transaction = await knex('transactions').insert({
// 		id: crypto.randomUUID(),
// 		title: 'Test',
// 		amount: 147.99,
// 	}).returning('*');

// 	return transaction;
// });

app
	.listen({ port: env.HTTP_PORT })
	.then(() => {
		console.log(`HTTP server running at ${env.HTTP_PORT}`);
	});