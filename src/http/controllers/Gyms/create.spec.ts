import request from 'supertest';
import {app} from '@/app';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';


describe('Create gyms', ()=> {

	beforeAll(async ()=> {
		await app.ready();
	});

	afterAll(async()=> {
		await app.close();
	});
  
	it('should be able to create gym', async()=> {
		const {token} = await createAndAuthenticateUser(app, true);
		const response =  await request(app.server).post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JavaScript',
				description: 'Some description',
				phone: '198893939',
				latitude: -26.9758029,
				longitude: -48.6396307
			});
    
		expect(response.statusCode).toEqual(201);
		
	});
});