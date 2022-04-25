import Config, { ConfigInterface } from '@config'
import { Logger } from './logger'
import { Schema } from 'mongoose'
import path from 'path'
import _ from 'lodash'
import { User } from '@models/user'
import { Role } from '@models/role'
import { NewsLetter } from '@models/newsletter'
import DataSources from '@datasources/index'

const { ObjectId } = Schema.Types

const config: ConfigInterface = Config()

const Models: {
	Role: typeof Role
	User: typeof User
	NewsLetter: typeof NewsLetter
} = { Role, User, NewsLetter }

// Export Global Variables
export { Logger }
// TODO: Pass config.NODE_ENDPOINT to below instantiation.
export const App = {
	EXTENSION_ECOSYSTEM: path.extname(__filename) === '.js' ? 'js' : 'ts',
	Http: {
		app: null,
	},
	Models,
	Config: config,
	Database: null,
	datasources: DataSources,
	ObjectId,
}

// Assign them to Global
export const Global: any = global
Global.Logger = Logger
Global.App = App
Global._ = _
