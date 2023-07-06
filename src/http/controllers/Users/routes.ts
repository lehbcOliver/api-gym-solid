import { FastifyInstance } from 'fastify';
import { register } from './register';
import { Authenticate } from './authenticate';
import { Profile } from './profile';
import { VerifyJWT } from '@/http/middlewares/verify-jwt';
import { refresh } from './refresh';


export async function userRoutes(app: FastifyInstance){
	app.post('/users', register);
	app.post('/sessions', Authenticate);

	app.patch('/token/refresh', refresh);
	//Authenticate
	app.get('/me', {onRequest:[VerifyJWT]}, Profile);
}