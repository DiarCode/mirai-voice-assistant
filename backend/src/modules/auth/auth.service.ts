import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { Repository } from 'typeorm'
import { APP_CONFIG } from '../../configs/env.config'
import { AppDataSource } from '../../data-source'
import { UserDTO } from '../users/users.dto'
import { Users } from '../users/users.model'
import { LoginDTO, SignupDTO } from './auth.dto'

class AuthService {
	private readonly usersRepository: Repository<Users> =
		AppDataSource.getRepository(Users)

	private generateToken(userId: number): string {
		return jwt.sign({ userId }, APP_CONFIG.JWT.SECRET, {
			expiresIn: APP_CONFIG.JWT.EXPIRATION,
		})
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10)
	}

	private async comparePasswords(
		plainPassword: string,
		hashedPassword: string
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword)
	}

	private setCookie(res: Response, token: string): void {
		res.cookie('token', token, {
			httpOnly: true,
			secure: APP_CONFIG.NODE_ENV === 'production',
			maxAge: 3600000,
			sameSite: 'lax',
		})
	}

	async login(req: Request, res: Response): Promise<any> {
		const { email, password }: LoginDTO = req.body

		try {
			const user = await this.usersRepository.findOneBy({ email })

			if (!user) {
				return res.status(401).json({ message: 'Invalid credentials' })
			}

			const isPasswordValid = await this.comparePasswords(
				password,
				user.password
			)

			if (!isPasswordValid) {
				return res.status(401).json({ message: 'Invalid credentials' })
			}

			const token = this.generateToken(user.id)
			this.setCookie(res, token)

			return res.json({ message: 'Login successful' })
		} catch (error) {
			console.error('Error during login:', error)
			return res.status(500).json({ message: 'Internal server error' })
		}
	}

	async signup(req: Request, res: Response): Promise<any> {
		const { firstName, lastName, email, password }: SignupDTO = req.body

		try {
			const existingUser = await this.usersRepository.findOneBy({ email })

			if (existingUser) {
				return res.status(400).json({ message: 'Email already in use' })
			}

			const hashedPassword = await this.hashPassword(password)

			const newUser = this.usersRepository.create({
				firstName,
				lastName,
				email,
				password: hashedPassword,
			})

			await this.usersRepository.save(newUser)

			return res.status(201).json({ message: 'User created successfully' })
		} catch (error) {
			console.error('Error during signup:', error)
			return res.status(500).json({ message: 'Internal server error' })
		}
	}

	async getCurrentUser(req: Request, res: Response): Promise<any> {
		const user: Users = req['user']

		if (!user) {
			return res.status(401).json({ message: 'Unauthorized: No user found' })
		}

		const dto: UserDTO = {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		}

		return res.json(dto)
	}
}

export const authService = new AuthService()
