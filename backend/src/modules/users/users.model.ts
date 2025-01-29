import { IsEmail } from 'class-validator'
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm'
import { Reminders } from '../reminder/reminder.model'

@Entity({ name: 'users' })
@Unique(['email'])
export class Users {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: false })
	firstName: string

	@Column({ nullable: false })
	lastName: string

	@Column({ nullable: false })
	@IsEmail({}, { message: 'Invalid email address' })
	email: string

	@Column({ nullable: false })
	password: string

	@OneToMany(() => Reminders, reminder => reminder.user)
	reminders: Reminders[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
