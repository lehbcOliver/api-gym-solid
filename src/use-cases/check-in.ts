import { checkInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distancia-between-coordenates';
import { MaxNumberofChecsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

interface CheckInUseCaseRequest{
  userId:string;
  gymId:string;
	userLatitude: number;
	userLongitute: number;
}

interface CheckInUseCaseResponse{
  checkIn: CheckIn
}


export class CheckInUseCase {
	constructor(
		private checkInsRepository:checkInsRepository,
		private gymsRepository: GymsRepository
	){}

	async execute({userId, gymId, userLatitude, userLongitute}: CheckInUseCaseRequest):Promise<CheckInUseCaseResponse>{

		const gym = await this.gymsRepository.findById(gymId);
		if(!gym){
			throw new ResourceNotFoundError;
		}

		const distance = getDistanceBetweenCoordinates(
			{latitude: userLatitude, longitude: userLongitute},
			{latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
		);

		const MAX_DISTANCE_IN_KM = 0.1;

		if(distance > MAX_DISTANCE_IN_KM){
			throw new MaxDistanceError();
		}
		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

		if(checkInOnSameDay){
			throw new MaxNumberofChecsError();
		}
		const checkIn = await this.checkInsRepository.create({
			gym_id: gymId,
			user_id: userId
		});
		return {checkIn};
	}
}