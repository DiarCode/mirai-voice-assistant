import { AppQueryClientProvider } from '@/core/components/query-client-provider'
import { ThemeProvider } from '@/core/components/theme-proivder'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserratSans = Montserrat({
	variable: '--font-montserrat-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Mirai | Future AI Voice Assistant',
	description:
		'An AI voice assistant for real-time conversations, document analysis, and personal task management.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${montserratSans.variable} antialiased`}>
				<AppQueryClientProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</AppQueryClientProvider>
			</body>
		</html>
	)
}
