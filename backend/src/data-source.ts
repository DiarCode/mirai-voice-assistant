import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { APP_CONFIG } from './configs/env.config'
import { Reminders } from './modules/reminder/reminder.model'
import { Users } from './modules/users/users.model'

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: APP_CONFIG.DATABASE.DB_HOST,
	port: parseInt(APP_CONFIG.DATABASE.DB_PORT),
	username: APP_CONFIG.DATABASE.DB_USERNAME,
	password: APP_CONFIG.DATABASE.DB_PASSWORD,
	database: APP_CONFIG.DATABASE.DB_NAME,

	synchronize: APP_CONFIG.NODE_ENV === 'development' ? true : false,
	logging: false,
	entities: [Users, Reminders],
	migrations: [__dirname + '/migration/*.ts'],
	subscribers: [],
})
