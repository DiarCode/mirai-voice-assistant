// assistant.controller.ts
import { Request, Response } from 'express'
import { Users } from '../users/users.model'
import { runMiraiAgent } from './assistant-agent'
import { renameFileWithExtension } from './assistant-audio.service'
import { transcribeAudio } from './assistant-openapi.service'

export class AssistantController {
	async askAssistant(req: Request, res: Response): Promise<any> {
		try {
			const currentUser: Users = req['user']
			const audioFilePath = req.file?.path

			if (!audioFilePath) {
				return res.status(400).json({ error: 'No audio file uploaded.' })
			}

			// 1. Transcribe local audio
			const userTranscript = await transcribeAudio(
				renameFileWithExtension(audioFilePath, 'wav')
			)

			// 2. Build system context
			const systemContext = `
        You are Mirai, a smart assistant named after the Japanese word for "future". 
        The user's name is ${currentUser.firstName} ${currentUser.lastName}, userId: ${currentUser.id}.
        If asked about your name, respond with "My name is Mirai..."
        If asked about your features, respond with "I can answer any question and also create reminders for you."
      `

			// 3. Single agent call
			const response = await runMiraiAgent({
				userPrompt: userTranscript,
				systemContext,
			})

			console.log('REEEESPONSE', response)

			return res.status(200).json({
				message: 'Processed successfully',
				userTranscript,
				systemTranscript: response.output,
				audioBase64: null, // or response.audioData
			})
		} catch (err) {
			console.error('Error processing audio:', err)
			return res.status(500).json({ error: 'Internal server error.' })
		}
	}
}

export const assistantController = new AssistantController()
