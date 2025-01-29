import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Users } from '../users/users.model'

@Entity({ name: 'reminders' })
export class Reminders {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: false })
	text: string

	@Column({ type: 'timestamptz' })
	reminderTime: Date

	@ManyToOne(() => Users, user => user.reminders)
	user: Users

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
