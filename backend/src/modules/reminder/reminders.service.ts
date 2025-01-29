import { AppDataSource } from '../../data-source'
import { Reminders } from './reminder.model'
import { CreateReminderDTO, UpdateReminderDTO } from './reminders.dto'

class ReminderService {
	private reminderRepo = AppDataSource.getRepository(Reminders)

	async createReminder(dto: CreateReminderDTO): Promise<Reminders> {
		const reminder = this.reminderRepo.create({
			text: dto.text,
			reminderTime: dto.reminderTime,
			user: { id: dto.userId },
		})

		return this.reminderRepo.save(reminder)
	}

	async getReminderById(id: number, userId: number): Promise<Reminders | null> {
		return this.reminderRepo.findOne({
			where: {
				id,
				user: { id: userId },
			},
			relations: ['user'],
		})
	}

	async listReminders(userId: number): Promise<Reminders[]> {
		return this.reminderRepo.find({
			where: { user: { id: userId } },
			order: { reminderTime: 'ASC' },
		})
	}

	async updateReminder(
		id: number,
		userId: number,
		dto: UpdateReminderDTO
	): Promise<Reminders | null> {
		const reminder = await this.getReminderById(id, userId)

		if (!reminder) {
			throw new Error('Reminder not found or you do not have access to it.')
		}

		Object.assign(reminder, dto)

		return this.reminderRepo.save(reminder)
	}

	async deleteReminder(id: number, userId: number): Promise<boolean> {
		const reminder = await this.getReminderById(id, userId)
		if (!reminder) {
			throw new Error('Reminder not found or you do not have access to it.')
		}

		const result = await this.reminderRepo.remove(reminder)
		return !!result
	}
}

export const reminderService = new ReminderService()
