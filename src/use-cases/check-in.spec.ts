import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { describe, it, beforeEach, expect, vi, afterEach } from 'vitest';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberofChecsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';




let checkInsRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-In Use Case', ()=> {

	beforeEach(async ()=> {
		checkInsRepository = new InMemoryCheckInRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: 'Gym-01',
			title: 'Academy JavaScript Gym',
			description: '',
			phone: '',
			latitude: -26.9892264,
			longitude: -48.6331075
		});
		vi.useFakeTimers();
	});

	afterEach(()=> {
		vi.useRealTimers();
	});

	it('should be able to check in', async ()=> {

		const {checkIn} = await sut.execute({
			gymId: 'Gym-01',
			userId: 'user-01',
			userLatitude: -26.9892264,
			userLongitute: -48.6331075
		});
		expect(checkIn.id).toEqual(expect.any(String));
	});
	

	it('should not be able to check in twice in the same day', async()=>{
		vi.setSystemTime(new Date(2022, 0 , 20, 8,0,0));
		await sut.execute({
			gymId: 'Gym-01',
			userId: 'user01',
			userLatitude: -26.9892264,
			userLongitute: -48.6331075
		});

		await expect(()=> sut.execute({
			gymId: 'Gym-01',
			userId: 'user01',
			userLatitude: -26.9892264,
			userLongitute: -48.6331075
		}))
			.rejects.toBeInstanceOf(MaxNumberofChecsError);
	});

	it('should not be able to check in twice but in different days', async()=>{
		vi.setSystemTime(new Date(2022, 0 , 20, 8,0,0));
		await sut.execute({
			gymId: 'Gym-01',
			userId: 'user01',
			userLatitude: -26.9892264,
			userLongitute: -48.6331075
		});

		vi.setSystemTime(new Date(2022, 0 , 21, 8,0,0));
		const {checkIn} = await sut.execute({
			gymId: 'Gym-01',
			userId: 'user01',
			userLatitude: -26.9892264,
			userLongitute: -48.6331075
		});
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('should not be able to check in on distant gym', async ()=> {

		gymsRepository.items.push({
			id: 'Gym-02',
			title: 'Academy JavaScript Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-26.9758029),
			longitude: new Decimal(-48.6396307)
		});

		await expect(()=>  sut.execute({
			gymId: 'Gym-02',
			userId: 'user-01',
			userLatitude: -26.9892264,
			userLongitute: -48.6331075
		})).rejects.toBeInstanceOf(MaxDistanceError);
		
	});
});
