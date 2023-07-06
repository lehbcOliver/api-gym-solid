import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExists } from './errors/user-already-exists';
import { User } from '@prisma/client';

interface IRegisterUseCaseRequest{
  name:string;
  email: string;
  password:string;
}

interface IRegisterUseCaseResponse{
	user:User;
}

export class RegisterUseCase {


	constructor(private usersRepository: UsersRepository){}

	async execute({name, email, password}:IRegisterUseCaseRequest):Promise<IRegisterUseCaseResponse> {
		const password_hash = await hash(password, 6);
		
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if(userWithSameEmail){
			throw new UserAlreadyExists();
		}
    
    
		const user = await this.usersRepository.create({
			name,
			email, 
			password_hash
		});
		return {user};
	}
}
