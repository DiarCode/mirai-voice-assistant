import { apiClient } from '@/core/configs/axios-instance.config'
import {
	AskAssistantRequestDTO,
	AskAssistantResponseDTO,
} from '../models/assistant.dto'

class AssistantService {
	async askAssistant(
		dto: AskAssistantRequestDTO
	): Promise<AskAssistantResponseDTO> {
		const formData = new FormData()
		formData.append('audio', dto.audioFile)

		try {
			const response = await apiClient.post<AskAssistantResponseDTO>(
				`/assistant/ask`,
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
					withCredentials: true, // Ensure cookies are sent
				}
			)
			return response.data
		} catch (error) {
			throw new Error('Failed to ask assistant: ' + error)
		}
	}
}

export const assistantService = new AssistantService()
