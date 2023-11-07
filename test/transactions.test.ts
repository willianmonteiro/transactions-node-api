import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Transactions', () => {
	beforeAll(async () => {
		await app.ready();
	});
  
	afterAll(async () => {
		await app.close();
	});
  
	it('Should be able to create create a new transaction', async () => {
		const response = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction from test',
				amount: 5000,
				type: 'income'
			});
		expect(response.statusCode).toBe(201);
	});

   
	it('Should be able to list all transactions', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction from test',
				amount: 5000,
				type: 'income'
			});

		const cookies = createTransactionResponse.get('Set-Cookie');
		const response = await request(app.server)
			.get('/transactions')
			.set('Cookie', cookies);

		expect(response.body.transactions).toEqual([
			expect.objectContaining(createTransactionResponse.body)
		]);
	});
});