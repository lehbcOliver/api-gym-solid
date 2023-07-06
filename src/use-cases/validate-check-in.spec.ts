import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { describe, it, beforeEach, expect, afterEach, vi } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';




let checkInsRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-In Use Case', ()=> {

	beforeEach(async ()=> {
		checkInsRepository = new InMemoryCheckInRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(()=> {
		vi.useRealTimers();
	});

	it('should be able to validate the check-in', async ()=> {

		const createCheckin = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});

		const {checkIn} = await sut.execute({
			checkId: createCheckin.id
		});
		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it('should not be able to validate an inexistent check-in', async ()=> {
		await expect(()=> 
			sut.execute({
				checkId: 'Inexistent'
			})).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to validate the check-in after 20 minutes of this creation', async()=> {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

		const createCheckin = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		});

		const twentyOneMinutesInMs = 1000 * 60 * 21;
		vi.advanceTimersByTime(twentyOneMinutesInMs);

		await expect(()=>  sut.execute({
			checkId: createCheckin.id
		})).rejects.toBeInstanceOf(Error);
	});
	
});
