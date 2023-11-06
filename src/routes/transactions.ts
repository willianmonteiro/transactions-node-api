import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';

export async function transactionRoutes(app: FastifyInstance) {
	app.post('/', async (request, response) => {
		const createTransactionSchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(['income', 'expense']),
		});
		const { title, amount, type } = createTransactionSchema.parse(request.body);
		const transaction = await knex('transactions')
			.insert({
				id: crypto.randomUUID(),
				title, 
				amount: type === 'income' ? amount : amount * -1,
			})
			.returning('*');

		response
			.status(201)
			.send(transaction);
	});
}