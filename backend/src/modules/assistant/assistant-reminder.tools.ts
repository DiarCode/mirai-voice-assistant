import { DynamicStructuredTool } from '@langchain/core/tools'
import { z } from 'zod'
import { reminderService } from '../reminder/reminders.service'
import { assistantLLM } from './assistant-openapi.service'

export const createReminderTool = new DynamicStructuredTool({
	name: 'createReminder',
	description: 'Creates a reminder with a specific time and text for a user.',
	schema: z.object({
		text: z.string().describe('The text of the reminder.'),
		reminderTime: z
			.string()
			.describe('The time for the reminder in ISO 8601 format.'),
		userId: z.number().describe('The ID of the user creating the reminder.'),
	}),
	func: async ({
		text,
		reminderTime,
		userId,
	}: {
		text: string
		reminderTime: string
		userId: number
	}) => {
		const dto = {
			text,
			reminderTime: new Date(reminderTime),
			userId,
		}

		const reminder = await reminderService.createReminder(dto)
		return `Reminder created with ID: ${reminder.id}, text: "${
			reminder.text
		}", time: "${reminder.reminderTime.toISOString()}"`
	},
})

export const listRemindersTool = new DynamicStructuredTool({
	name: 'listReminders',
	description: 'Lists all reminders for a specific user.',
	schema: z.object({
		userId: z
			.number()
			.describe('The ID of the user whose reminders should be listed.'),
	}),
	func: async ({ userId }: { userId: number }) => {
		const reminders = await reminderService.listReminders(userId)

		if (reminders.length === 0) {
			return 'No reminders found.'
		}

		return reminders
			.map(
				(reminder: {
					id: any
					text: any
					reminderTime: { toISOString: () => any }
				}) =>
					`ID: ${reminder.id}, Text: "${
						reminder.text
					}", Time: "${reminder.reminderTime.toISOString()}"`
			)
			.join('\n')
	},
})

export const deleteReminderTool = new DynamicStructuredTool({
	name: 'deleteReminder',
	description: 'Deletes a reminder by ID for a specific user.',
	schema: z.object({
		id: z.number().describe('The ID of the reminder to delete.'),
		userId: z.number().describe('The ID of the user who owns the reminder.'),
	}),
	func: async ({ id, userId }: { id: number; userId: number }) => {
		const success = await reminderService.deleteReminder(id, userId)
		if (success) {
			return `Reminder with ID: ${id} has been successfully deleted.`
		}
		return `Failed to delete reminder with ID: ${id}. It may not exist or you may not have permission to delete it.`
	},
})

export const updateReminderTool = new DynamicStructuredTool({
	name: 'updateReminder',
	description: 'Updates an existing reminder for a specific user.',
	schema: z.object({
		id: z.number().describe('The ID of the reminder to update.'),
		userId: z.number().describe('The ID of the user who owns the reminder.'),
		text: z.string().optional().describe('The updated text of the reminder.'),
		reminderTime: z
			.string()
			.optional()
			.describe('The updated time for the reminder in ISO 8601 format.'),
	}),
	func: async ({
		id,
		userId,
		text,
		reminderTime,
	}: {
		id: number
		userId: number
		text?: string
		reminderTime?: string
	}) => {
		const updateDTO = {
			...(text && { text }),
			...(reminderTime && { reminderTime: new Date(reminderTime) }),
		}

		const updatedReminder = await reminderService.updateReminder(
			id,
			userId,
			updateDTO
		)

		if (updatedReminder) {
			return `Reminder with ID: ${
				updatedReminder.id
			} has been updated to text: "${
				updatedReminder.text
			}" and time: "${updatedReminder.reminderTime.toISOString()}".`
		}
		return `Failed to update reminder with ID: ${id}. It may not exist or you may not have permission to update it.`
	},
})

const tools = [
	createReminderTool,
	listRemindersTool,
	deleteReminderTool,
	updateReminderTool,
]
export const assistantLLMWithTools = assistantLLM.bindTools(tools)
