import { gql } from 'apollo-server-express'

const userTypes = gql`
	type Query {
		"Get User details"
		user(id: String!): User!
		"Get All User details"
		users(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: UserOrderByInput!
			filters: UserWhereInput
		): UserConnection!
	}

	type Mutation {
		verifyUser(input: Input!): ResponsePayload!
		blockUser(input: Input!): ResponsePayload!
	}
	type UserEdge {
		cursor: ID!
		node: User
	}

	type UserConnection {
		edges: [UserEdge]
		pageInfo: PageInfo!
	}

	enum UserOrderByInput {
		createdAt_ASC
		createdAt_DESC
		name_ASC
		name_DESC
	}
	input UserWhereInput {
		name: String
		email: String
		accountType: String
	}
	type User {
		id: ID!
		fullName: String
		email: String
		mobile: String
		countryCode: String
		profilePic: String
		isVerified: Boolean
		role: Role
	}

	type UserEdge {
		cursor: ID!
		node: User
	}

	type UserConnection {
		edges: [UserEdge]
		pageInfo: PageInfo!
	}

	type PageInfo {
		endCursor: ID
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: ID
	}

	type ResponsePayload {
		message: String!
		status: String!
	}

	input Input {
		id: String!
	}
	enum AccountType {
		ADMIN
		SUB_ADMIN
		SUPER_ADMIN
		USER
	}
`

export default userTypes
