import request from 'supertest';
import {app} from '@/app';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';


describe('Register e2e', ()=> {

	beforeAll(async ()=> {
		await app.ready();
	});

	afterAll(async()=> {
		await app.close();
	});
  
	it('should be able to register', async()=> {
		const response = await request(app.server).post('/users').send({
			name: 'Teste user',
			email: 'teste@teste.com.br',
			password: '123456'
		});
		expect(response.statusCode).toEqual(201);
	});
});