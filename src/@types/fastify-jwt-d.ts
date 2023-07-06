import '@fastify/jwt';

declare module '@fastify/jwt'{
  interface FastifyJWT{
    user: {
      sub: number  //aqui era string 
      role: 'ADMIN' | 'MEMBER'
    }
  }
}