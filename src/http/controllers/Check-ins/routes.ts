import { FastifyInstance } from 'fastify';
import { VerifyJWT } from '@/http/middlewares/verify-jwt';
import { create } from './create';
import { validate } from './validated';
import { history } from './history';
import { metrics } from './metric';



export async function checkInRoutes(app: FastifyInstance){
	app.addHook('onRequest', VerifyJWT);

	app.post('/gyms/:gymId/check-ins', create);
	app.patch('/check-ins/:checkId/validate', validate);
	app.get('/check-ins/history', history);
	app.get('/check-ins/metrics', metrics);
}