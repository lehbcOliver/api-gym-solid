import { Prisma, CheckIn } from '@prisma/client';
import { checkInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInRepository implements checkInsRepository{
  
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {

		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date()
		};
		this.items.push(checkIn);
		return checkIn;
	}
	async findByUserIdOnDate(userId: string, date: Date){

		const startOfDay = dayjs(date).startOf('date');
		const endOfDay = dayjs(date).endOf('date');

		const checkOnSameDate = this.items.find((checkIn)=> {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDate = checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);

			return checkIn.user_id === userId && isOnSameDate;
		}); 

		if(!checkOnSameDate){
			return null;
		}
		return checkOnSameDate;
	}
	
	async findManyByUserId(userId: string, page:number){
		return this.items.filter(item=> item.user_id === userId)
			.slice((page-1)* 20, page * 20);
	}
	async countByUserId(userId: string): Promise<number> {
		return this.items.filter((item)=> item.user_id === userId).length;
	}

	async findById(id: string){
		const checkIn = this.items.find((item)=> item.id === id);
		
		if(!checkIn){
			return null;
		}
		return checkIn;
	}

	async save(checkIn:CheckIn){
		const checkIndex = this.items.findIndex(item => item.id === checkIn.id);

		if(checkIndex >= 0 ){
			this.items[checkIndex] = checkIn;
		}

		return checkIn;
	}
}

