import { cn } from '@/core/lib/tailwind.utils'
import { Message, MessageType } from '../models/message.model'

const userMessageClasses =
	'rounded-2xl bg-gray-500/20 backdrop-blur-lg text-white self-end border border-gray-500/20 px-5 py-3 text-base'
const systemMessageClasses = 'rounded-2xl bg-blue-500/20 backdrop-blur-lg text-white self-start border border-blue-500/20 px-5 py-3 text-base'

export const ChatBubble = ({ message }: { message: Message }) => (
	<div
		className={cn(
			message.type === MessageType.USER
				? userMessageClasses
				: systemMessageClasses
		)}
	>
		{message.content}
	</div>
)
