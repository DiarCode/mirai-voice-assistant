import { SignupForm } from '@/modules/auth/components/signup-form'

export default function LoginPage() {
	return (
		<div className='flex flex-col justify-center items-center bg-muted p-6 md:p-10 min-h-svh'>
			<div className='w-full max-w-sm md:max-w-3xl'>
				<SignupForm />
			</div>
		</div>
	)
}
