import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ['current-user'],
		queryFn: authService.getCurrentUser,
	})
}
