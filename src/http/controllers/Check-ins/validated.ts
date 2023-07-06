import { FastifyReply, FastifyRequest } from 'fastify';
import {z} from 'zod';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validated-check-in-use-case';


export async function validate (request:FastifyRequest, reply:FastifyReply) {

	const validateCheckInParamsSchema = z.object({
		checkId: z.string().uuid()
	});

	const { checkId } = validateCheckInParamsSchema.parse(request.params);

	const validateCheckInUseCase = makeValidateCheckInUseCase();
	await validateCheckInUseCase.execute({
		checkId
	});
	
	return reply.status(204).send();
}