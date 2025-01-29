import { AxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from './core/configs/axios-instance.config'
import { UserDTO } from './modules/users/models/user.dto'

const protectedRoutes = ['/app']
const publicRoutes = ['/auth/login', '/auth/signup', '/']

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname
	const isProtectedRoute = protectedRoutes.includes(path)
	const isPublicRoute = publicRoutes.includes(path)

	try {
		const cookiesStore = await cookies()
		const token = cookiesStore.get('token')?.value

		const options: AxiosRequestConfig | undefined = token
			? {
					headers: {
						Cookie: `token=${token};`,
					},
			  }
			: undefined

		const { data: currentUser } = await apiClient.get<UserDTO>(
			'/auth/current',
			options
		)

		if (isProtectedRoute && !currentUser) {
			return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
		}

		if (
			isPublicRoute &&
			currentUser &&
			!req.nextUrl.pathname.startsWith('/app')
		) {
			return NextResponse.redirect(new URL('/app', req.nextUrl))
		}
	} catch (error) {
		console.error('Error in middleware:', error)

		if (isProtectedRoute) {
			return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
		}
	}

	return NextResponse.next()
}

// Middleware routes configuration
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
