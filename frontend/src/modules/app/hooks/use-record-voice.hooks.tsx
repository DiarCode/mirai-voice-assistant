'use client'

import { useEffect, useRef, useState } from 'react'

// Define the return type of the hook
interface UseRecordVoice {
	recording: boolean
	startRecording: () => void
	stopRecording: () => void
	audioBlob: Blob | null
	error: string | null
}

export const useRecordVoice = (): UseRecordVoice => {
	const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
	const [recording, setRecording] = useState(false)
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
	const [error, setError] = useState<string | null>(null)
	const chunks = useRef<Blob[]>([])

	const startRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.start()
			setRecording(true)
		} else {
			setError('MediaRecorder not initialized')
		}
	}

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop()
			setRecording(false)
		} else {
			setError('MediaRecorder not initialized')
		}
	}

	const initializeMediaRecorder = (stream: MediaStream) => {
		try {
			const recorder = new MediaRecorder(stream)

			recorder.onstart = () => {
				chunks.current = []
			}

			recorder.ondataavailable = (event: BlobEvent) => {
				chunks.current.push(event.data)
			}

			recorder.onstop = () => {
				const blob = new Blob(chunks.current, { type: 'audio/wav' })
				setAudioBlob(blob)
			}

			setMediaRecorder(recorder)
		} catch (err) {
			setError((err as Error).message)
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then(initializeMediaRecorder)
				.catch(err => setError(err.message))
		}
	}, [])

	return { recording, startRecording, stopRecording, audioBlob, error }
}
