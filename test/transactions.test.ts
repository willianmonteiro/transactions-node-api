import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Transactions', () => {
	beforeAll(async () => {
		await app.ready();
	});
  
	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		execSync('npm run knex migrate:rollback --all');
		execSync('npm run knex migrate:latest');
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
			.set('Cookie', cookies)
			.expect(200);

		expect(response.body.transactions).toEqual([
			expect.objectContaining(createTransactionResponse.body)
		]);
	});

	it('Should be able to get a specific transactions', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction from test',
				amount: 5000,
				type: 'income'
			});

		const cookies = createTransactionResponse.get('Set-Cookie');
		const response = await request(app.server)
			.get(`/transactions/${createTransactionResponse.body.id}`)
			.set('Cookie', cookies)
			.expect(200);
		expect(response.body.transaction)
			.toEqual(expect.objectContaining(createTransactionResponse.body));
	});

	it('Should be able to get a statement', async () => {
		const createTransactionResponse = await request(app.server)
			.post('/transactions')
			.send({
				title: 'Transaction from test',
				amount: 5000,
				type: 'income'
			});

		const cookies = createTransactionResponse.get('Set-Cookie');
		await request(app.server)
			.post('/transactions')
			.set('Cookie', cookies)
			.send({
				title: 'Other transaction from test',
				amount: 2000,
				type: 'expense'
			});

		const response = await request(app.server)
			.get('/transactions/statement')
			.set('Cookie', cookies)
			.expect(200);
		expect(response.body.statement).toEqual({ amount: 3000 });
	});
});