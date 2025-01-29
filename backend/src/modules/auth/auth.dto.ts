export interface JwtPayload {
	userId: number
}

export interface LoginDTO {
	email: string
	password: string
}

export interface SignupDTO {
	firstName: string
	lastName: string
	email: string
	password: string
}
