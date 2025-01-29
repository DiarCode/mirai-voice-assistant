import { Router } from 'express'
import * as multer from 'multer'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { assistantController } from './assistant.controller'

export const assistantRouter = Router()
const upload = multer({ dest: 'uploads/' })

assistantRouter.post(
	'/ask',
	authMiddleware,
	upload.single('audio'),
	assistantController.askAssistant
)
