export class MaxNumberofChecsError extends Error{
	constructor(){
		super('Max number of check-in reached');
	}
}