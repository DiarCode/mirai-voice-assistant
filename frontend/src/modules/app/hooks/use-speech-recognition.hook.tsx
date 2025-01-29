'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import SpeechRecognition, {
	useSpeechRecognition as useSpeechRecognitionLib,
} from 'react-speech-recognition'

interface UseSpeechRecognitionOptions {
	lang?: string
	silenceTimeout?: number // Milliseconds before stopping on silence
	onFinalTranscript?: (transcript: string) => void
	onInterimTranscript?: (transcript: string) => void
	onEnd?: () => void
}

export default function useSpeechRecognition({
	lang = 'en-US',
	silenceTimeout = 5000,
	onFinalTranscript = () => {},
	onInterimTranscript = () => {},
	onEnd = () => {},
}: UseSpeechRecognitionOptions) {
	const { transcript, interimTranscript, resetTranscript } =
		useSpeechRecognitionLib()
	const [isListening, setIsListening] = useState(false)
	const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Stable `onEnd` reference
	const stableOnEnd = useCallback(onEnd, [onEnd])

	const onFinalTranscriptCallback = useCallback(onFinalTranscript, [
		onFinalTranscript,
	])

	// Start listening
	const startListening = useCallback(() => {
		resetTranscript()
		SpeechRecognition.startListening({
			continuous: true,
			language: lang,
		})
		setIsListening(true)
	}, [lang, resetTranscript])

	// Stop listening
	const stopListening = useCallback(() => {
		SpeechRecognition.stopListening()
		setIsListening(false)
		if (silenceTimer.current) {
			clearTimeout(silenceTimer.current)
			silenceTimer.current = null
		}
		stableOnEnd()
	}, [stableOnEnd])

	// Reset silence timer
	const resetSilenceTimer = useCallback(() => {
		if (silenceTimer.current) clearTimeout(silenceTimer.current)
		silenceTimer.current = setTimeout(() => {
			stopListening()
		}, silenceTimeout)
	}, [silenceTimeout, stopListening])

	// Manage silence timeout
	useEffect(() => {
		if (isListening && interimTranscript.trim()) {
			resetSilenceTimer()
		}
	}, [interimTranscript, isListening, resetSilenceTimer])

	// Handle transcripts
	useEffect(() => {
		if (transcript.trim()) {
			onFinalTranscriptCallback(transcript)
		}
		if (interimTranscript.trim()) {
			onInterimTranscript(interimTranscript)
		}
	}, [
		transcript,
		interimTranscript,
		onInterimTranscript,
		onFinalTranscriptCallback,
	])

	return {
		isListening,
		startListening,
		stopListening,
		transcript,
		interimTranscript,
	}
}
