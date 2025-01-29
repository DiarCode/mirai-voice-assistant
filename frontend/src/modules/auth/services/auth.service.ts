import { apiClient } from '@/core/configs/axios-instance.config'
import { UserDTO } from '@/modules/users/models/user.dto'
import { LoginDTO, SignupDTO } from '../models/auth.dto'

class AuthService {
	async login(dto: LoginDTO) {
		try {
			const response = await apiClient.post(`/auth/login`, dto)
			return response.data
		} catch (e) {
			throw new Error('Failed to login: ' + e)
		}
	}

	async signup(dto: SignupDTO) {
		try {
			const response = await apiClient.post(`/auth/signup`, dto)
			return response.data
		} catch (e) {
			throw new Error('Failed to signup: ' + e)
		}
	}

	async getCurrentUser() {
		try {
			const response = await apiClient.get<UserDTO>(`/auth/current`)
			return response.data
		} catch (e) {
			throw new Error('Failed to get current user: ' + e)
		}
	}
}

export const authService = new AuthService()
