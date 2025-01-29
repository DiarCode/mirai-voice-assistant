'use client'

import { useCurrentUser } from '@/modules/auth/hooks/use-current-user.hook'

export function Greeting() {
	const { data: currentUser } = useCurrentUser()

	return (
		<div className='mx-auto px-4 lg:px-6 py-4 w-full max-w-2xl'>
			<div className='flex-1 h-full'>
				<p className='font-light text-2xl text-gray-200/80 md:text-4xl'>
					Welcome Back,
				</p>
				<p className='mt-1 font-medium text-2xl md:text-4xl'>
					{currentUser?.firstName}
				</p>
			</div>
		</div>
	)
}
