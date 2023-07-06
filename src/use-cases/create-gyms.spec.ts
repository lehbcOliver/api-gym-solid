import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymsUseCase } from './create-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymsUseCase;

describe('Create Gym Use Case', ()=>{
	beforeEach(()=> {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymsUseCase(gymsRepository);
	});

	it('should be able to create gym', async()=> {
		const {gym} = await sut.execute({
			title: 'Gym Teste',
			description: null, 
			phone: null,
			latitude: -26.9892264,
			longitude: -48.6331075
		});
		expect(gym.id).toEqual(expect.any(String));
	});
});