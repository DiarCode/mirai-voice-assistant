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
	const [isProcessing, setIsProcessing] = useState<boolean>(true) // Loading indicator
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	// Use the voice recorder hook
	const {
		audioBlob,
		startRecording,
		stopRecording,
		error: recordingError,
	} = useRecordVoice()

	// Handle state changes (toggle listening/chat)
	const handleStateChange = () => {
		setErrorMessage(null) // Clear errors on new attempt

		if (state === ChatStates.LISTENING) {
			// Stop recording
			stopRecording()
			setState(ChatStates.CHAT)
		} else if (state === ChatStates.INITIAL || state === ChatStates.CHAT) {
			// Clear chat messages when starting a new recording
			setMessages([])
			// Start recording
			startRecording()
			setState(ChatStates.LISTENING)
		}
	}

	// Handle sending audioBlob to the backend when recording stops
	useEffect(() => {
		if (audioBlob) {
			// Indicate we are now waiting for backend processing
			setIsProcessing(true)

			const audioFile = new File([audioBlob], 'recording.wav', {
				type: 'audio/wav',
			})

			// Call the assistant service
			assistantService
				.askAssistant({ audioFile })
				.then(response => {
					// Update messages with the transcription
					setMessages(prev => [
						// Append to any existing messages if you like:
						...prev,
						{ type: MessageType.USER, content: response.userTranscript },
						{ type: MessageType.SYSTEM, content: response.systemTranscript },
					])

					// If audioBase64 is present, play the audio response
					if (response.audioBase64) {
						const audio = new Audio(
							`data:audio/wav;base64,${response.audioBase64}`
						)
						audio.play().catch(err => console.error('Audio play error:', err))
					}
				})
				.catch(err => {
					console.error('Error from assistant:', err?.message || err)
					setErrorMessage('Error processing your request.')
					setMessages(prev => [
						...prev,
						{
							type: MessageType.SYSTEM,
							content: 'Error processing your request.',
						},
					])
				})
				.finally(() => {
					setIsProcessing(false)
				})
		}
	}, [audioBlob])

	return (
		<AppLayout>
			{/* Greeting Section (only show if no conversation yet) */}
			{state === ChatStates.INITIAL && <Greeting />}

			{/* Main Container for Chat */}
			<div className='mx-auto px-4 lg:px-6 py-4 w-full max-w-2xl h-full'>
				{/* Show chat only after we have started chatting */}
				{state === ChatStates.CHAT && (
					<ChatSection messages={messages} isProcessing={isProcessing} />
				)}

				{/* If no chat yet, show example questions */}
				{state === ChatStates.INITIAL && <ExampleQuestions />}

				{/* If waiting for response, show a loading spinner or placeholder */}
			</div>

			{/* Toolbar with Record/Stop button */}
			<div className='flex justify-center w-full'>
				<Toolbar state={state} setState={handleStateChange} />
			</div>


			{/* Error Messages */}
			{(recordingError || errorMessage) && (
				<div className='mt-2 text-center text-red-500 text-sm'>
					{recordingError || errorMessage}
				</div>
			)}
		</AppLayout>
	)
}
