import { ChatOpenAI } from '@langchain/openai'
import axios from 'axios'
import * as fs from 'fs'

export const assistantLLM = new ChatOpenAI({
	model: 'gpt-4o-audio-preview',
	temperature: 0,
	modelKwargs: {
		modalities: ['text', 'audio'],
		audio: { voice: 'alloy', format: 'wav' },
	},
})

export async function transcribeAudio(filePath: string): Promise<string> {
	// Example using OpenAI Whisper API
	const formData = new FormData()
	formData.append('file', fs.createReadStream(filePath))
	formData.append('model', 'whisper-1')

	const response = await axios.post(
		'https://api.openai.com/v1/audio/transcriptions',
		formData,
		{
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'multipart/form-data',
			},
		}
	)

	return response.data.text
}
