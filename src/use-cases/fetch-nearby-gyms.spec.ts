import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, it, expect } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', ()=> {

	beforeEach(async()=> {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it('should be able to fetch nearby gyms', async()=> {

		await gymsRepository.create({
			title: 'Typescript gym',
			description: null,
			phone: null,
			latitude: -27.0239432,
			longitude: -48.6507205

		});
		await gymsRepository.create({
			title: 'Academia java',
			description: null,
			phone: null,
			latitude: -26.3081473,
			longitude: -48.8409719

		});

		const {gyms} = await sut.execute({
			userLatitude: -27.0239432,
			userLongitude: -48.6507205
		});
		console.log(gyms);
		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({title: 'Typescript gym',}),
		]);
	});
 
	

});