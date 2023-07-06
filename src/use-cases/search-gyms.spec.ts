import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';
import { beforeEach, describe, it, expect } from 'vitest';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', ()=> {

	beforeEach(async()=> {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it('should be able to search for gyms', async()=> {

		await gymsRepository.create({
			title: 'Javascript Gym',
			description: null,
			phone: null,
			latitude: -26.9892264,
			longitude: -48.6331075
		});

		await gymsRepository.create({
			title: 'Typescript gym',
			description: null,
			phone: null,
			latitude: -26.9892264,
			longitude: -48.6331075

		});


		const {gyms} = await sut.execute({
			query: 'Javascript',
			page: 1,
		});
		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({title: 'Javascript Gym',}),
		]);
	});
 
	it('should be able to fetch paginated gyms search', async()=> {
		for(let i=1; i <= 22; i++){
			await gymsRepository.create({
				title: `JavaScript Gyms ${i}`,
				description: null,
				phone: null,
				latitude: -26.9892264,
				longitude: -48.6331075
			});
		}
		const {gyms} = await sut.execute({
			query: 'JavaScript',
			page: 2,
		});
		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({title: 'JavaScript Gyms 21'}),
			expect.objectContaining({title: 'JavaScript Gyms 22'}),
		]);
	});

});