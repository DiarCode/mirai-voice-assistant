'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { queryClient } from '../configs/query-client.config'

export function AppQueryClientProvider({ children }: React.PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
