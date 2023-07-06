import { FastifyReply, FastifyRequest } from 'fastify';
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';


export async function metrics (request:FastifyRequest, reply:FastifyReply) {

	const getUserMetricUseCase = makeGetUserMetricsUseCase();
	const {checkInsCount} = await getUserMetricUseCase.execute({
		userId: (request.user.sub).toString(),
	});
	
	return reply.status(200).send({checkInsCount});
}