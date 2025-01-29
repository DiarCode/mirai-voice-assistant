import { RunnableSequence } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { AgentExecutor, AgentStep } from 'langchain/agents'
import { formatToOpenAIFunctionMessages } from 'langchain/agents/format_scratchpad'
import { OpenAIFunctionsAgentOutputParser } from 'langchain/agents/openai/output_parser'

// Your existing tools (createReminderTool, listRemindersTool, etc.)
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import {
	createReminderTool,
	deleteReminderTool,
	listRemindersTool,
	updateReminderTool,
} from './assistant-reminder.tools'

const prompt = (input: { input: string; agent_scratchpad: string }) => {
	return input.input
}

// 1) The ChatOpenAI model with text+audio
const modelWithFunctions = new ChatOpenAI({
	modelName: 'gpt-4o-audio-preview', // or your chosen model
	temperature: 0,
	modelKwargs: {
		modalities: ['text', 'audio'],
		audio: { voice: 'alloy', format: 'wav' },
	},
})

const runnableAgent = RunnableSequence.from([
	{
		input: (i: { input: string; steps: AgentStep[] }) => i.input,
		agent_scratchpad: (i: { input: string; steps: AgentStep[] }) =>
			formatToOpenAIFunctionMessages(i.steps),
	},
	prompt,
	modelWithFunctions,
	new OpenAIFunctionsAgentOutputParser(),
])

const executor = AgentExecutor.fromAgentAndTools({
	agent: runnableAgent,
	tools: [
		createReminderTool,
		listRemindersTool,
		deleteReminderTool,
		updateReminderTool,
	],
})

export async function runMiraiAgent({
	userPrompt,
	systemContext,
}: {
	userPrompt: string
	systemContext: string
}) {
	const response = await executor.invoke({
		messages: [new SystemMessage(systemContext), new HumanMessage(userPrompt)],
	})
	return response
}
