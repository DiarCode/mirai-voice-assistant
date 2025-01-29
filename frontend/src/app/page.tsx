'use client'

import aiOrbAnimation from '@/core/assets/animations/ai_orb_landing.json'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { useEffect, useRef } from 'react'

const FEATURES = [
	'Real-time Voice',
	'Document Analysis',
	'Task Management',
	'Contextual AI',
	'Secure Storage',
]

export default function LandingPage() {
	const gradientRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let frame: number
		const animateGradient = () => {
			if (gradientRef.current) {
				const gradientStyle = `
          linear-gradient(
            135deg,
            rgba(23, 23, 65, 1) 0%,
            rgba(40, 15, 75, 1) 50%,
            rgba(80, 10, 80, 1) 100%
          )
        `
				gradientRef.current.style.background = gradientStyle
				gradientRef.current.style.backgroundSize = '200% 200%'
				gradientRef.current.style.animation = 'gradientMove 20s ease infinite'
			}
			frame = requestAnimationFrame(animateGradient)
		}
		animateGradient()
		return () => cancelAnimationFrame(frame)
	}, [])

	return (
		<div
			ref={gradientRef}
			className='flex justify-center items-center w-screen h-screen text-white overflow-hidden'
		>
			<style jsx global>{`
				@keyframes gradientMove {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}
			`}</style>

			<div className='relative z-10 flex flex-col items-center space-y-8 px-4 max-w-6xl text-center'>
				{/* Animated Lottie Sphere */}
				<div className='relative'>
					<motion.div
						initial={{ scale: 1 }}
						animate={{ scale: [1, 1.15, 1] }}
						transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
					>
						<Lottie
							animationData={aiOrbAnimation}
							loop={true}
							className='w-72 h-72'
						/>
					</motion.div>
				</div>

				{/* Title */}
				<h1 className='bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 font-bold text-6xl text-transparent'>
					MIRAI
				</h1>

				{/* Description */}
				<p className='max-w-xl text-gray-300 text-lg'>
					Your AI-powered voice assistant for real-time conversations, document
					analysis, and personal task management.
				</p>

				{/* Features Grid */}
				<div className='flex flex-wrap justify-center gap-2 w-full max-w-lg'>
					{FEATURES.map((feature, index) => (
						<motion.div
							key={index}
							className='border-indigo-400/20 bg-indigo-900/10 hover:bg-indigo-900/20 backdrop-blur-sm px-4 py-3 border rounded-lg text-sm transition-all'
							whileHover={{ scale: 1.02 }}
						>
							<p className='font-medium text-center text-indigo-100'>
								{feature}
							</p>
						</motion.div>
					))}
				</div>

				{/* Get Started Button */}
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className='bg-white bg-gradient-to-r shadow-md mt-8 px-8 py-3 rounded-lg font-semibold text-black transition-all'
				>
					Get Started
				</motion.button>
			</div>
		</div>
	)
}
