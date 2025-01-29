export enum MessageType {
	USER = 'USER',
	SYSTEM = 'SYSTEM',
}

export interface Message {
	type: MessageType
	content: string
}

export enum ChatStates {
	INITIAL = 'INITIAL',
	LISTENING = 'LISTENING',
	CHAT = 'CHAT',
}
