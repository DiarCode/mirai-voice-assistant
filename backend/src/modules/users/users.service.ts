import { Repository } from 'typeorm'
import { AppDataSource } from '../../data-source'
import { Users } from './users.model'

interface CreateUserDTO {
	firstName: string
	lastName: string
	email: string
	password: string
}

interface UpdateUserDTO {
	firstName?: string
	lastName?: string
	email?: string
	password?: string
}

class UsersService {
	private usersRepo: Repository<Users>

	constructor() {
		this.usersRepo = AppDataSource.getRepository(Users)
	}

	async getUserById(id: number): Promise<Users | null> {
		return this.usersRepo.findOne({
			where: { id },
			relations: ['reminders'],
		})
	}

	async getUserByEmail(email: string): Promise<Users | null> {
		return this.usersRepo.findOne({
			where: { email },
		})
	}

	async updateUser(id: number, dto: UpdateUserDTO): Promise<Users | null> {
		const user = await this.getUserById(id)

		if (!user) {
			throw new Error(`User with ID ${id} not found.`)
		}

		Object.assign(user, dto)
		return this.usersRepo.save(user)
	}

	async deleteUser(id: number): Promise<boolean> {
		const result = await this.usersRepo.delete(id)
		return result.affected === 1
	}
}

export const usersService = new UsersService()
