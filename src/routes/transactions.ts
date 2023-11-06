import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { checkSessionIdExists } from '../middleware/check-session-id';

export async function transactionRoutes(app: FastifyInstance) {
	app.get('/', { preHandler: [checkSessionIdExists] }, async (request, response) => {
		const { sessionId } = request.cookies;
		const transactions = await knex('transactions')
			.where('session_id', sessionId)
			.select();

		return response
			.send({
				total: transactions.length,
				transactions
			});
	});

	app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request, response) => {
		const getTransactionParamsSchema = z.object({
			id: z.string().uuid(),
		});
		const { id } = getTransactionParamsSchema.parse(request.params);
		const { sessionId } = request.cookies;
		const transaction = await knex('transactions')
			.where({ id, session_id: sessionId })
			.first();
		return response.send({ transaction });
	});

	app.get('/statement', { preHandler: [checkSessionIdExists] }, async (request, response) => {
		const { sessionId } = request.cookies;
		const statement = await knex('transactions')
			.where('session_id', sessionId)
			.sum('amount', { as: 'amount' })
			.first();
		return response.send({ statement });
	});

	app.post('/', { preHandler: [checkSessionIdExists] }, async (request, response) => {
		const createTransactionSchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['income', 'expense']),
		});
		const { title, amount, type } = createTransactionSchema.parse(request.body);

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();
			response.setCookie('sessionId', sessionId, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7, // 7 days
			});
		}

		const transaction = await knex('transactions')
			.insert({
				id: randomUUID(),
				title, 
				amount: type === 'income' ? amount : amount * -1,
				session_id: sessionId
			})
			.returning('*');

		return response
			.status(201)
			.send(transaction);
	});
}