import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { APP_CONFIG } from '../configs/env.config'
import { JwtPayload } from '../modules/auth/auth.dto'
import { usersService } from '../modules/users/users.service'

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> {
	const token = req.cookies.token

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized: No token provided' })
	}

	try {
		const decoded: JwtPayload = jwt.verify(
			token,
			APP_CONFIG.JWT.SECRET
		) as JwtPayload

		const user = await usersService.getUserById(decoded.userId)
		if (!user) {
			return res.status(500).json({ message: 'Failed to get current user' })
		}

		req['user'] = user
		return next()
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized: Invalid token' })
	}
}
