import * as dotenv from 'dotenv'

dotenv.config()

export const APP_CONFIG = {
	NODE_ENV: process.env.NODE_ENV,
	CLIENT_URL: process.env.CLIENT_URL,
	PORT: parseInt(process.env.PORT) ?? 8080,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	JWT: {
		SECRET: process.env.JWT_SECRET,
		EXPIRATION: parseInt(process.env.JWT_EXPIRATION),
	},
	DATABASE: {
		DB_HOST: process.env.DB_HOST,
		DB_PORT: process.env.DB_PORT,
		DB_USERNAME: process.env.DB_USERNAME,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_NAME: process.env.DB_NAME,
	},
}
