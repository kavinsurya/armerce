import { gql } from 'apollo-server-express'

const authTypes = gql`
	type Mutation {
		"Sign Up for users"
		signUp(input: SignUpInput!): SignUpPayload!
		"Sign In for users"
		signIn(input: SignInInput!): SignInPayload!
	}
	input Links {
		"URl for facebook provided by the user"
		facebook: String
		"URl for twitter provided by the user"
		twitter: String
		"URl for instagram provided by the user"
		instagram: String
		"URl for instagram provided by the user"
		website: String
		"URl for instagram provided by the user"
		discord: String
	}
	input SignUpInput {
		username: String
		fullName: String!
		email: String!
		countryCode: String!
		mobile: String!
		password: String!
		profilePic: String
		coverPic: String
		description: String
		socialCreds: Links
	}

	type SignUpPayload {
		"Response message in string"
		message: String!
		"Status of the response in boolean for success or failure"
		status: String!
	}

	input SignInInput {
		email: String!
		password: String!
	}

	type SignInMutPayload {
		"Response message in string"
		message: String!
		"Bearer Token for next time Authentication"
		token: String
		"Status of the response in boolean for success or failure"
		status: String!
	}

	enum GrantType {
		"Type for Password"
		PASSWORD
		"Type for TwoFactorAuthentication"
		twoFA
		"Type for Google Authenticator QR generated"
		qrGenerated
	}

	enum ResetPasswordReqType {
		"Type for Request"
		REQUEST
		"Type for TwoFactorAuthentication"
		twoFA
	}

	type SignInPayload {
		"Response message in string"
		message: String!
		"Reference code will be sent to user mobile when grantType will be twoFA"
		referenceCode: String
		"It is boolean for first time verification"
		isFirstLogin: Boolean
		"Bearer Token for next time Authentiaction"
		token: String
		"QR Code for Google Authenticator"
		qrCode: String
		"acoount type in enum ADMIN, SUPER_ADMIN"
		accountTypeCode: AccountType
		"Mobile nmuber of the user"
		mobile: String
		"Country code of the user"
		countryCode: String
	}

	enum updateMobileReqType {
		"Type for update"
		UPDATE
		"Type for TwoFactorAuthentication"
		twoFA
	}

	enum updatePasswordReqType {
		"Type for update"
		UPDATE
		"Type for TwoFactorAuthentication"
		twoFA
	}
`

export default authTypes
