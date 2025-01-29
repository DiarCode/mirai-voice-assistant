import { Message } from '../models/message.model'
import { ChatBubble } from './app-chat-bubble'

export function ChatSection({ messages }: { messages: Message[] }) {
	return (
		<div className='flex flex-col items-center space-y-4 border-gray-500/20 bg-gray-500/10 p-6 border rounded-3xl w-full h-full overflow-y-auto'>
			{messages.map((message, index) => (
				<ChatBubble key={index} message={message} />
			))}
		</div>
	)
}
