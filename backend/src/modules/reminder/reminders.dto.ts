export interface CreateReminderDTO {
	text: string
	reminderTime: Date
	userId: number
}

export interface UpdateReminderDTO {
	text?: string
	reminderTime?: Date
}
