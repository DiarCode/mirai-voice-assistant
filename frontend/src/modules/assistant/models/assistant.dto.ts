export interface AskAssistantRequestDTO {
	audioFile: File
}

export interface AskAssistantResponseDTO {
	message: string
	userTranscript: string
	systemTranscript: string
	audioBase64: string | null
}
