import axios from 'axios'

const apiUrl = `${process.env.API_URL || 'http://localhost:8080'}/api/v1`

export const apiClient = axios.create({
	baseURL: apiUrl,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

apiClient.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	response => response,
	async error => {
		if (error.response && error.response.status === 401) {
			console.error('Unauthorized access - redirecting to login')
		}
		return Promise.reject(error)
	}
)
