import { UserInputError } from 'apollo-server-errors'
import { Logger } from '@core/globals'
import { ProductDoc } from '@models/product'

interface getProductPayload {
	id: string
}

interface Context {
	dataSources: any
}

export const product = {
	Query: {
		async product(
			__: any,
			{ id }: getProductPayload,
			{ dataSources: { Product } }: Context,
			info: any
		): Promise<ProductDoc> {
			Logger.info('Inside getProduct Resolvers')
			try {
				const product = await Product.getProductById(id, info)

				if (!product) {
					throw new UserInputError('Product does not exist.')
				}

				return product
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
	Product: {
		async createdBy(
			{ createdById }: { createdById: string },
			__: any,
			{ dataSources: { User } },
			info: any
		) {
			Logger.info('Inside createdBy Resolver')
			try {
				return await User.getUser(createdById, info)
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
		async updateBy(
			{ updatedById }: { updatedById: string },
			__: any,
			{ dataSources: { User } },
			info: any
		) {
			Logger.info('Inside updatedById Resolver')
			try {
				return User.getUser(updatedById, info)
			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
}
