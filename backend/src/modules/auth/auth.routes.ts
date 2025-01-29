import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { authService } from './auth.service'

export const authRouter = Router()

// Define authentication routes
authRouter.post('/login', (req, res) => authService.login(req, res))
authRouter.post('/signup', (req, res) => authService.signup(req, res))
authRouter.get('/current', authMiddleware, (req, res) =>
	authService.getCurrentUser(req, res)
)
