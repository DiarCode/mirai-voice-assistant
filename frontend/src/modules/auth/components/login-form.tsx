'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/core/components/ui/button'
import { Card, CardContent } from '@/core/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { cn } from '@/core/lib/tailwind.utils'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoginDTO } from '../models/auth.dto'
import { authService } from '../services/auth.service'

const loginSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long.' }),
})

type LoginType = z.infer<typeof loginSchema>

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const form = useForm<LoginType>({
		resolver: zodResolver(loginSchema),
	})

	const router = useRouter()

	const { mutate: login } = useMutation({
		mutationFn: (dto: LoginDTO) => authService.login(dto),
		onSuccess: () => {
			router.push('/app')
		},
	})

	const onSubmit = (data: LoginType) => {
		login({
			email: data.email,
			password: data.password,
		})
	}

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card className='overflow-hidden'>
				<CardContent className='grid md:grid-cols-2 p-0'>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4 p-6 md:p-8'
						>
							<div className='flex flex-col items-center text-center'>
								<h1 className='font-bold text-2xl'>Welcome back</h1>
								<p className='text-balance text-muted-foreground'>
									Login to your Mirai account
								</p>
							</div>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												id='email'
												type='email'
												placeholder='m@example.com'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input id='password' type='password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full'>
								Login
							</Button>

							<div className='text-center text-sm'>
								Don&apos;t have an account?{' '}
								<Link
									href='/auth/signup'
									className='underline underline-offset-4'
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
					<div className='md:block relative hidden bg-muted'>
						<img
							src='https://images.unsplash.com/photo-1717501220582-af14e7c247b5?q=80&w=2616&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							alt='Image'
							className='dark:brightness-[0.2] absolute inset-0 w-full h-full dark:grayscale object-cover'
						/>
					</div>
				</CardContent>
			</Card>
			<div className='text-balance text-center text-muted-foreground text-xs hover:[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
				and <a href='#'>Privacy Policy</a>.
			</div>
		</div>
	)
}
