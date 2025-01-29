import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import * as cors from 'cors'
import * as express from 'express'
import helmet from 'helmet'
import * as morgan from 'morgan'
import 'reflect-metadata'
import { APP_CONFIG } from './configs/env.config'
import { AppDataSource } from './data-source'
import { initRoutes } from './routes'

const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(compression())
app.use(cors({ origin: APP_CONFIG.CLIENT_URL, credentials: true }))

initRoutes(app)

AppDataSource.initialize()
	.then(async () => {
		app.listen(APP_CONFIG.PORT, () => {
			console.log('Server is running on http://localhost:' + APP_CONFIG.PORT)
		})
		console.log('Data Source has been initialized!')
	})
	.catch(error => console.log(error))
