import { Application } from 'express'
import { authRouter } from './modules/auth/auth.routes'
import { assistantRouter } from './modules/assistant/assistant.routes'

export const initRoutes = (app: Application): void => {
	app.use('/api/v1/auth', authRouter)
	app.use('/api/v1/assistant', assistantRouter)
}
