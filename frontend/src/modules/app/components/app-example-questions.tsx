const exampleQuestions = [
	"What's the weather today in LA?",
	"What's the capital of Japan?",
	'Who is Albert Einstein?',
]

export function ExampleQuestions() {
	return (
		<div className='flex flex-col justify-end items-center space-y-2 border-gray-500/20 bg-gray-500/10 p-6 border rounded-3xl w-full h-full overflow-y-auto'>
			<p className='mb-2 text-gray-300/80 text-sm self-end'>Try asking...</p>
			{exampleQuestions.map(q => (
				<div
					key={q}
					className='border-gray-500/20 bg-gray-500/20 backdrop-blur-lg px-5 py-3 border rounded-2xl max-w-xs text-base text-white cursor-pointer self-end'
				>
					{q}
				</div>
			))}
		</div>
	)
}
