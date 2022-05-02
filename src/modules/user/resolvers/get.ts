import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { UserSchemaDoc } from '@models/user'

interface getUserPayload {
	id: string
}

interface Context {
	dataSources: any
}

export const user = {
	Query: {
		async user(
			__: any,
			{ id }: getUserPayload,
			{ dataSources: { User } }: Context,
			info: any
		): Promise<UserSchemaDoc> {
			Logger.info('Inside getUser Resolvers')
			try {
				const user = await User.getUserById(id, info)

				if (!user) {
					throw new UserInputError('User does not exist.')
				}

				return user
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
	User: {
		async role({ roleId }: { roleId: string }, __: any, { dataSources: { Role } }, info: any) {
			Logger.info('Inside createdBy Resolver')
			try {
				const data = await Role.getRoleById(roleId, info)
				return data
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
