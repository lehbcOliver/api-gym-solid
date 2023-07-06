import request from 'supertest';
import {app} from '@/app';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';


describe('Nearby  gyms', ()=> {

	beforeAll(async ()=> {
		await app.ready();
	});

	afterAll(async()=> {
		await app.close();
	});
  
	it('should be able to list nearby gyms', async()=> {
		const {token} = await createAndAuthenticateUser(app, true);

      
		await request(app.server).post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Typescript gym',
				description: null,
				phone: null,
				latitude: -27.0239432,
				longitude: -48.6507205
			});
      
		await request(app.server).post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Academia java',
				description: null,
				phone: null,
				latitude: -26.3081473,
				longitude: -48.8409719
			});

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -27.0239432,
				longitude: -48.6507205
			})
			.set('Authorization', `Bearer ${token}`)
			.send();

		
		expect(response.statusCode).toEqual(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Typescript gym'
			})
		]);
		
	});
});