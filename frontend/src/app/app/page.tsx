'use client'

import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'

import { ChatSection } from '@/modules/app/components/app-chat-section'
import { ExampleQuestions } from '@/modules/app/components/app-example-questions'
import { Greeting } from '@/modules/app/components/app-greeting'
import { AppLayout } from '@/modules/app/components/app-layout'
import { Toolbar } from '@/modules/app/components/app-toolbar'
import { useRecordVoice } from '@/modules/app/hooks/use-record-voice.hooks'
import {
	ChatStates,
	Message,
	MessageType,
} from '@/modules/app/models/message.model'
import { assistantService } from '@/modules/assistant/services/assistant.service'

export default function MainAppPage() {
	const [state, setState] = useState<ChatStates>(ChatStates.INITIAL)
	const [messages, setMessages] = useState<Message[]>([])

	// Use the voice recorder hook
	const { audioBlob, startRecording, stopRecording, error } = useRecordVoice()

	// Handle state changes (toggle listening/chat)
	const handleStateChange = () => {
		if (state === ChatStates.LISTENING) {
			stopRecording() // Stop recording
			setState(ChatStates.CHAT)
		} else if (state === ChatStates.INITIAL || state === ChatStates.CHAT) {
			startRecording() // Start recording
			setState(ChatStates.LISTENING)
		}
	}

	// Handle sending audioBlob to the backend when recording stops
	useEffect(() => {
		if (audioBlob) {
			const audioFile = new File([audioBlob], 'recording.wav', {
				type: 'audio/wav',
			})

			// Call the assistant service
			assistantService
				.askAssistant({ audioFile })
				.then(response => {
					// Update messages with the transcription
					setMessages([
						{ type: MessageType.USER, content: response.userTranscript },
						{ type: MessageType.SYSTEM, content: response.systemTranscript },
					])

					// If audioBase64 is present, play the audio response
					if (response.audioBase64) {
						const audio = new Audio(
							`data:audio/wav;base64,${response.audioBase64}`
						)
						audio.play()
					}
				})
				.catch(err => {
					console.error('Error from assistant:', err.message)
					setMessages(prev => [
						...prev,
						{
							type: MessageType.SYSTEM,
							content: 'Error processing your request.',
						},
					])
				})
		}
	}, [audioBlob])

	return (
		<AppLayout>
			{/* Greeting Section */}
			{state === ChatStates.INITIAL && <Greeting />}

			{/* Chat Section */}
			<div className='mx-auto px-4 lg:px-6 py-4 w-full max-w-2xl h-full'>
				{state === ChatStates.CHAT && <ChatSection messages={messages} />}
				{state === ChatStates.INITIAL && <ExampleQuestions />}
			</div>

			{/* Toolbar */}
			<div className='flex justify-center w-full'>
				<Toolbar state={state} setState={handleStateChange} />
			</div>

			{/* Error Message */}
			{error && (
				<div className='bottom-4 left-4 absolute text-red-500 text-sm'>
					Error: {error}
				</div>
			)}
		</AppLayout>
	)
}
