import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricUseCase } from './get-user-metric';

let checkInsRepository: InMemoryCheckInRepository;
let sut: GetUserMetricUseCase;

describe('Get user metric use case', ()=> {

	beforeEach(()=> {
		checkInsRepository = new InMemoryCheckInRepository();
		sut = new GetUserMetricUseCase(checkInsRepository);
	});

	it('should be able to get check-ins count from metrics', async ()=> {

		await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user01'
		});

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user01'
		});

		const {checkInsCount} = await sut.execute({
			userId: 'user01'
		});
		expect(checkInsCount).toEqual(2);
	});
});