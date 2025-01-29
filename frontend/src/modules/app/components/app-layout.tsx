import { ReactNode } from 'react'

export function AppLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex flex-col bg-gradient-to-tr from-[#000000] via-[#060657] to-[#ba37e2] w-screen h-screen text-white overflow-hidden'>
			{children}
		</div>
	)
}
