import chatLoadingAnimation from '@/core/assets/animations/chat_loading.json'
import Lottie from 'lottie-react'
import { Message } from '../models/message.model'
import { ChatBubble } from './app-chat-bubble'

interface ChatSectionProps {
	messages: Message[]
	isProcessing: boolean
}

export function ChatSection({ messages, isProcessing }: ChatSectionProps) {
	return (
		<div className='flex flex-col items-center space-y-4 border-gray-500/20 bg-gray-500/10 p-6 border rounded-3xl w-full h-full overflow-y-auto'>
			{isProcessing && (
				<div className='flex justify-center'>
					<div className='size-32'>
						<Lottie animationData={chatLoadingAnimation} loop autoPlay />
					</div>
				</div>
			)}

			{!isProcessing &&
				messages.map((message, index) => (
					<ChatBubble key={index} message={message} />
				))}
		</div>
	)
}
