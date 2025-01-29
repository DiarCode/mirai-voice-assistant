import { OpenAIWhisperAudio } from '@langchain/community/document_loaders/fs/openai_whisper_audio'
import { ChatOpenAI } from '@langchain/openai'

export const assistantLLM = new ChatOpenAI({
	model: 'gpt-4o-audio-preview',
	temperature: 0,
	modelKwargs: {
		modalities: ['text', 'audio'],
		audio: { voice: 'alloy', format: 'wav' },
	},
})

export async function transcribeAudio(filePath: string) {
	const loader = new OpenAIWhisperAudio(filePath)
	const docs = await loader.load()

	return docs[0].pageContent
}

// assistantAgent.ts


