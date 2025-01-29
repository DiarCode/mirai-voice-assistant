import sphereAnimation from '@/core/assets/animations/ai_orb_main.json'
import { Button } from '@/core/components/ui/button'
import { cn } from '@/core/lib/tailwind.utils'
import Lottie from 'lottie-react'
import { Keyboard, LayoutDashboard } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { ChatStates } from '../models/message.model'

export function Toolbar({
	state,
	setState,
}: {
	state: ChatStates
	setState: Dispatch<SetStateAction<ChatStates>>
}) {
	return (
		<div className='flex justify-between items-center px-4 lg:px-6 py-4 w-full max-w-2xl'>
			<Button size='icon' variant='ghost'>
				<LayoutDashboard className='!size-8' />
			</Button>

			<div className='relative'>
				<div
					className={cn(
						'absolute w-full left-0 right-0 -top-20 transition-all',
						state === ChatStates.LISTENING ? 'opacity-100' : 'opacity-0'
					)}
				>
					<p className='text-3xl text-center text-gray-300'>Listening...</p>
				</div>

				<button
					onClick={() =>
						setState(prev =>
							prev === ChatStates.INITIAL || prev === ChatStates.CHAT
								? ChatStates.LISTENING
								: ChatStates.CHAT
						)
					}
					className={cn(
						'transition-transform',
						state === ChatStates.LISTENING && 'scale-150'
					)}
				>
					<Lottie
						animationData={sphereAnimation}
						loop
						className={cn(
							'transition-transform hover:scale-125 size-32',
							state === ChatStates.LISTENING && 'scale-125 hover:scale-125'
						)}
					/>
				</button>
			</div>

			<Button size='icon' variant='ghost'>
				<Keyboard className='!size-8' />
			</Button>
		</div>
	)
}
