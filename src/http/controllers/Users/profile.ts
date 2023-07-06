import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function Profile(request:FastifyRequest, reply: FastifyReply){

	const getUserProfile = makeGetUserProfileUseCase();
	const {user} = await getUserProfile.execute({
		userId: (request.user.sub).toString()
	});

	return reply.status(200).send({
		user: {
			...user,
			password_hash:undefined
		}
	});
}