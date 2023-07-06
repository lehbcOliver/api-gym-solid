import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app:FastifyInstance, isAdmin = false){
	await prisma.user.create({
		data: {
			name: 'Teste user',
			email: 'teste@teste.com.br',
			password_hash: await hash('123456', 6),
			role: isAdmin ? 'ADMIN' : 'MEMBER'
		}
	});
	const authResponse = await request(app.server).post('/sessions').send({
		email: 'teste@teste.com.br',
		password: '123456'
	});

	const {token}  = authResponse.body;

	return {token};
}