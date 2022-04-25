import { gql } from 'apollo-server-express'

const roleTypes = gql`
	type Query {
		"A list of roles"
		roles(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: RoleOrderByInput!
			filters: RoleWhereInput
		): RoleConnection!
		"A role details"
		role(id: String!): Role!
	}

	type Mutation {
		"To create a role"
		createRole(input: CreateRoleInput!): messageResponse!
		"Update Role with Permissions of Superuser"
		updateRole(where: RoleWhereUpdateInput!, input: UpdateRoleInput!): messageResponse!
		"Delete Role with Permissions of Superuser"
		deleteRole(where: RoleWhereUpdateInput!): messageResponse!
	}
	type messageResponse {
		"Response Message in string for success or failure."
		message: String!
		"Status of the response in boolean for success or failure."
		status: String!
	}

	type Role {
		id: ID!
		name: String!
		isActive: Boolean!
		permissions: Permissions!
		createdBy: User!
		createdAt: Date
	}

	type Permissions {
		Dashboard: DashboardBoolean
		Admin: PermissionsBoolean
		Transaction: PermissionsBoolean
		Product: ProductsBoolean
		User: UserBoolean
		Role: RoleBoolean
		ActivityLog: ActivityLogBoolean
		Analytics: AnalyticsBoolean
		Coupen: CoupenBoolean
	}

	type PermissionsBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}
	type RoleBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}
	type DashboardBoolean {
		GET_REPORT: Boolean!
		GET_SALES: Boolean!
	}

	type ProductsBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		BLACKLIST: Boolean!
		DELETE: Boolean!
	}

	type UserBoolean {
		BLOCK: Boolean!
		UN_BLOCK: Boolean!
		VERIFY: Boolean!
		UN_VERIFY: Boolean!
		GET: Boolean!
		GET_ALL: Boolean!
	}

	type ActivityLogBoolean {
		GET: Boolean!
		GET_ALL: Boolean!
	}

	type AnalyticsBoolean {
		GET_ONBOARDING_REPORTS: Boolean!
		EXPORT_ONBOARDING_REPORTS: Boolean!
		GET_SALES_REPORTS: Boolean!
		EXPORT_SALES_REPORTS: Boolean!
		GET_ISSUES_REPORTS: Boolean!
		EXPORT_ISSUES_REPORTS: Boolean!
	}

	type CoupenBoolean {
		CREATE_COUPENS: Boolean!
		UPDATE_COUPENS: Boolean!
		DELETE_COUPENS: Boolean!
	}

	type RoleEdge {
		"A cursor for use in pagination."
		cursor: ID!
		"A post at the end of an edge."
		node: Role
	}

	type RoleConnection {
		"A list of post edges."
		edges: [RoleEdge]
		"Information to assist with pagination."
		pageInfo: PageInfo!
	}

	enum RoleOrderByInput {
		"Order role ascending by creation time."
		createdAt_ASC
		"Order role decending by creation time."
		createdAt_DESC
		"Order role ascending by name."
		name_ASC
		"Order role ascending by name."
		name_DESC
	}

	input RoleWhereInput {
		"Search point for key name in roles"
		name: String
		"Role status enum for true or false"
		isActiveBool: String
		"A date in proper format for createdAt from"
		createdAtFrom: String
		"A date in proper format for createdAt to"
		createdAtTo: String
		"Filter Based On Created By, Pass Object ID"
		createdById: ID
	}

	input PermissionsInput {
		Dashboard: DashboardBooleanInput
		Admin: PermissionsBooleanInput
		Transaction: PermissionsBooleanInput
		Product: ProductsBooleanInput
		User: UserBooleanInput
		Role: RoleBooleanInput
		ActivityLog: ActivityLogBooleanInput
		Analytics: AnalyticsBooleanInput
		Coupen: CoupenBooleanInput
	}

	input PermissionsBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}

	input DashboardBooleanInput {
		GET_REPORT: Boolean!
		GET_SALES: Boolean!
	}
	input RoleBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		DELETE: Boolean!
	}
	input ProductsBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
		CREATE: Boolean!
		UPDATE: Boolean!
		BLACKLIST: Boolean!
		DELETE: Boolean!
	}
	input UserBooleanInput {
		BLOCK: Boolean!
		UN_BLOCK: Boolean!
		VERIFY: Boolean!
		UN_VERIFY: Boolean!
		GET: Boolean!
		GET_ALL: Boolean!
	}

	input ActivityLogBooleanInput {
		GET: Boolean!
		GET_ALL: Boolean!
	}

	input AnalyticsBooleanInput {
		GET_ONBOARDING_REPORTS: Boolean!
		EXPORT_ONBOARDING_REPORTS: Boolean!
		GET_SALES_REPORTS: Boolean!
		EXPORT_SALES_REPORTS: Boolean!
		GET_ISSUES_REPORTS: Boolean!
		EXPORT_ISSUES_REPORTS: Boolean!
	}

	input CoupenBooleanInput {
		CREATE_COUPENS: Boolean!
		UPDATE_COUPENS: Boolean!
		DELETE_COUPENS: Boolean!
	}

	input CreateRoleInput {
		"Name of the role to create."
		name: String! @constraint(maxLength: 50)
		"Permissions for the role"
		permissions: PermissionsInput!
	}

	input RoleWhereUpdateInput {
		"Role id of the role"
		id: ID!
	}

	input UpdateRoleInput {
		"Name of the role to create."
		name: String @constraint(maxLength: 50)
		"Permissions for the role"
		permissions: PermissionsInput
	}
`

export default roleTypes
