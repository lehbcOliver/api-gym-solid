import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { userRoutes } from './http/controllers/Users/routes';
import { gymsRoutes } from './http/controllers/Gyms/routes';
import { checkInRoutes } from './http/controllers/Check-ins/routes';

export const app = fastify();

app.register(fastifyJwt,{
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false
	},
	sign: {
		expiresIn: '20m'
	}
});
app.register(cookie);
app.register(userRoutes);
app.register(gymsRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, _, reply)=> {
	if(error instanceof ZodError){
		return reply.status(400).send({
			message: 'Validatin error', issues: error.format()
		});
	}
	if(env.NODE_ENV !== 'production'){
		console.error(error);
	}
	return reply.status(500).send({message: 'Internal server error'});
});
