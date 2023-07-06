import { GetUserMetricUseCase } from '../get-user-metric';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-repository';

export function makeGetUserMetricsUseCase(){
	const checkInsRepository =  new PrismaCheckInsRepository();
	const useCase = new GetUserMetricUseCase(checkInsRepository);

	return useCase;
}