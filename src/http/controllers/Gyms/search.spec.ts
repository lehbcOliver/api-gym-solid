import request from 'supertest';
import {app} from '@/app';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';


describe('Search  gyms', ()=> {

	beforeAll(async ()=> {
		await app.ready();
	});

	afterAll(async()=> {
		await app.close();
	});
  
	it('should be able to search gym', async()=> {
		const {token} = await createAndAuthenticateUser(app, true);

		await request(app.server).post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'JavaScript Gym',
				description: 'Some description',
				phone: '198893939',
				latitude: -26.9758029,
				longitude: -48.6396307
			});
      
		await request(app.server).post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'TypeScript Gym',
				description: 'Some description',
				phone: '198893939',
				latitude: -26.9758029,
				longitude: -48.6396307
			});
    
		const response = await request(app.server)
			.get('/gyms/search')
			.query({query: 'TypeScript Gym'})
			.set('Authorization', `Bearer ${token}`)
			.send();

		
		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'TypeScript Gym'
			})
		]);
		
	});
});