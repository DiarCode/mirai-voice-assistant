import * as fs from 'fs'

// Validate and encode audio files
export const encodeAudioToBase64 = (filePath: string): string => {
	const renamedFilePath = renameFileWithExtension(filePath, 'wav')
	const audioBuffer = fs.readFileSync(renamedFilePath)
	return Buffer.from(audioBuffer).toString('base64')
}

export const saveBase64AudioToFile = (
	base64Audio: string,
	outputPath: string
): void => {
	const audioBuffer = Buffer.from(base64Audio, 'base64')
	fs.writeFileSync(outputPath, audioBuffer)
}

export const renameFileWithExtension = (
	filePath: string,
	extension: string
): string => {
	const newFilePath = `${filePath}.${extension}`
	fs.renameSync(filePath, newFilePath)
	return newFilePath
}
