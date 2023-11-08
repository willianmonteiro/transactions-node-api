
const transaction = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			format: 'uuid'
		},
		title: {
			type: 'string',
		},
		amount: {
			type: 'number'
		},
		created_at: {
			type: 'string',
		},
		session_id: {
			type: 'string',
		},
	}
};

export const getTransactionSchema = {
	response: {
		200: transaction
	}
};

export const getAllTransactionsSchema = {
	response: {
		200: {
			type: 'object',
			properties: {
				total: {
					type: 'number',
				},
				transactions: {
					type: 'array',
					items: transaction
				}
			}
		}
	}
};

export const createTransactionSchema = {
	params: {
		type: 'object',
		properties: {
			title: transaction.properties.title,
			amount: transaction.properties.amount,
			type: {
				type: 'string',
				enum: ['income', 'expense'],
			}
		}
	},
	response: {
		200: transaction
	}
};

export const getStatementSchema = {
	response: {
		200: {
			type: 'object',
			properties: {
				statement: {
					type: 'number'
				}
			}
		}
	}
};