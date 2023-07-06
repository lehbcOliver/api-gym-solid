import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { hash } from 'bcryptjs';
import { ResourceNotFoundError } from './errors/resource-not-found-error';


let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', ()=> {

	beforeEach(()=> {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it('should be able to get user profile', async()=> {
		const createUser = await usersRepository.create({
			name: 'John Doe', 
			email: 'johndoe@example.com',
			password_hash: await hash('123456',6)
		});
		
		const {user} = await sut.execute({
			userId: createUser.id
		});
		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to get user profile with wrong id', async()=> {
		expect(()=>
			sut.execute({
				userId: 'Teste'
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});