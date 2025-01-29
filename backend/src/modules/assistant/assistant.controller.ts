import { Request, Response } from 'express'
import { Users } from '../users/users.model'
import { encodeAudioToBase64 } from './assistant-audio.service'
import { assistantLLMWithTools } from './assistant-reminder.tools'

class AssistantController {
	async askAssistant(req: Request, res: Response): Promise<any> {
		try {
			const currentUser: Users = req['user']
			const audioFilePath = req.file?.path

			if (!audioFilePath) {
				return res.status(400).json({ error: 'No audio file uploaded.' })
			}

			const audioBase64 = encodeAudioToBase64(audioFilePath)

			// Structure messages according to API requirements
			const messages = [
				{
					role: 'system',
					content: `
            You are Mirai, a smart assistant named after the Japanese word for "future". 
            You can answer any question and manage reminders for the user. 
            The user's name is ${currentUser.firstName} ${currentUser.lastName}, and their userId is ${currentUser.id}.
            If asked about your name, say "My name is Mirai, inspired by the Japanese word for future."
            If asked about your features, respond with:
            "I can answer any question and also create reminders for you."
          `,
				},
				{
					role: 'human',
					content: [
						{ type: 'text', text: 'Transcribe and respond to this audio:' },
						{
							type: 'input_audio',
							input_audio: {
								data: audioBase64,
								format: 'wav',
							},
						},
					],
				},
			]

			// Get LLM response
			const response = await assistantLLMWithTools.invoke(messages)

			// Extract responses
			const userTranscript = response.content // Assuming transcription is in main content
			const systemTranscript = response.additional_kwargs?.text_response
			const audioResponse = response.additional_kwargs?.audio as { data?: any }

			return res.status(200).json({
				message: 'Processed successfully',
				userTranscript,
				systemTranscript: systemTranscript || response.content,
				audioBase64: audioResponse?.data || null,
			})
		} catch (error) {
			console.error('Error processing audio:', error)
			return res.status(500).json({ error: 'Internal server error.' })
		}
	}
}

export const assistantController = new AssistantController()
