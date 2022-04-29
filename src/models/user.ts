import { App } from '@core/globals'
import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'
import { Role } from '@core/constants/roles'
import { Password } from '@helpers/password'
import { GenerateRandomNumberOfLength, GenerateRandomStringOfLength } from '@core/utils'
const { ObjectId } = Schema.Types

export interface UserInput {
	username: string
	walletAddress?: string
	roleId: typeof ObjectId
}

export interface AdminInput {
	fullName?: string
	email?: string
	mobile: number
	countryCode: string
	roleId: typeof ObjectId
}

interface UserAttrs extends UserInput {
	accountType: Role
}

interface AdminAttrs extends AdminInput {
	accountType: Role
}

export interface UserSchemaDoc extends UserDoc {
	createVerificationCode: (codeType: string) => Promise<void>
	deleteVerificationCode: (codeType: string) => Promise<void>
	changedPasswordAfter: (JWTTimestamp: number) => boolean
	create2FACode: () => Promise<void>
	delete2FACode: () => Promise<void>
	createGoogleAuthVerificationCode: (data) => Promise<void>
	createGoogleAuthCode: (code: string) => Promise<void>
	deleteGoogleAuthCode: () => Promise<void>
	createResetPasswordCode: () => Promise<void>
	deleteResetPasswordCode: () => Promise<void>
	createForgotPasswordCode: () => Promise<void>
	deleteForgotPasswordCode: () => Promise<void>
}
export interface UserModel extends Model<UserSchemaDoc> {
	build(attrs: UserAttrs | AdminAttrs): UserDoc
	getById(value: string, projection: any): UserDoc
	getByEmail(email: string): UserDoc
	getBySocialId(provider: string, socialId: string): UserDoc
}

export interface UserDoc extends BaseModel, Document {
	_id: typeof ObjectId
	username?: string
	fullName: string
	walletAddress?: string
	email?: string
	emailVerifiedAt?: Date
	countryCode?: string
	mobile?: string
	mobileVerifiedAt?: Date
	password?: string
	passwordChangedAt?: Date
	permissions?: number[]
	isEmailVerified?: boolean
	roleId: typeof ObjectId
	totalBuyVolume?: number
	totalSellVolume?: number
	totalVolume24Hrs?: number
	totalVolume7Days?: number
	totalVolume30Days?: number
	totalSaleVolume24Hrs?: number
	totalSaleVolume7Days?: number
	totalSaleVolume30Days?: number
	verification?: {
		codeType: string
		referenceCode: string
		code: string
	}[]
	FCMToken?: string[]
	accountType: Role
	profilePic?: string
	coverPic?: string
	description?: string
	socialCreds?: {
		facebook?: string
		twitter?: string
		instagram?: string
		website?: string
		discord?: string
	}
	isFirstLogin?: boolean
	isQrGenerated?: boolean
	followingCount?: number
	followerCount?: number
	isVerified?: boolean
	isVerifiedFromBlockchain?: boolean
	isActive: boolean
	isBlocked: boolean
}

const UserSchema = new Schema<UserSchemaDoc>(
	{
		username: { type: String, unique: true, sparse: true },
		fullName: { type: String },
		email: { type: String, unique: true, sparse: true },
		emailVerifiedAt: Date,
		isEmailVerified: { type: Boolean, default: false },
		countryCode: { type: String },
		mobile: { type: String, unique: true, sparse: true },
		mobileVerifiedAt: Date,
		password: { type: String, select: false },
		passwordChangedAt: { type: Date },
		permissions: [Number],
		roleId: { type: ObjectId, ref: 'Role' },

		verification: {
			type: [
				{
					codeType: {
						type: String,
						enum: [
							'forgotPassword',
							'resetPassword',
							'email',
							'mobile',
							'googleAuth',
							'twoFA',
							null,
						],
					},
					referenceCode: String,
					code: String,
				},
			],
			_id: false,
			select: false,
		},

		profilePic: { type: String },
		coverPic: { type: String },
		description: { type: String },
		socialCreds: {
			type: {
				facebook: String,
				twitter: String,
				instagram: String,
				website: String,
				discord: String,
			},
			_id: false,
		},
		accountType: {
			type: String,
			default: Role.USER,
			enum: [Role.USER, Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN],
		},
		isFirstLogin: { type: Boolean, default: true },
		isQrGenerated: { type: Boolean, default: false },
		followingCount: { type: Number, default: 0 },
		followerCount: { type: Number, default: 0 },
		isVerified: { type: Boolean, default: false },
		isVerifiedFromBlockchain: { type: Boolean, default: false },
		isBlocked: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		createdById: { type: ObjectId, ref: 'User', select: false },
		updatedById: { type: ObjectId, ref: 'User', select: false },
	},
	{
		autoIndex: true,
		versionKey: false,
		timestamps: true,
	}
)

// Before Save Hook
UserSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'))
		this.set('password', hashed)
		this.set('passwordChangedAt', new Date())
	}
	done()
})

// Static Methods

// Function to create a new User
UserSchema.statics.build = async (attrs: UserAttrs | AdminAttrs) => {
	const user = new User(attrs)
	await user.save()
	return user
}

// Function to get document by id
UserSchema.statics.getById = async (value: string, projection = {}) => {
	return App.Models.User.findOne({ _id: value }, projection)
}

// Function to get document by email
UserSchema.statics.getByEmail = async (email: string) => {
	return App.Models.User.findOne({ email })
}

// Function to check if any document exits with the given socialId
UserSchema.statics.getBySocialId = (provider, socialId) => {
	const key = `socialId.${provider}`
	return App.Models.User.findOne({ [key]: socialId })
}

// Check for password change timings
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
	let changedTimestamp: number

	if (this.passwordChangedAt) {
		changedTimestamp = Number(new Date(this.passwordChangedAt).getTime() / 1000)
	}

	return JWTTimestamp < changedTimestamp
}

//  Create Validation Codes
UserSchema.methods.createVerificationCode = async function (codeType: string): Promise<void> {
	await this.verification.push({
		codeType: codeType,
		code: GenerateRandomNumberOfLength(4),
		referenceCode: GenerateRandomStringOfLength(10),
	})
}

// Nullify verification
UserSchema.methods.deleteVerificationCode = async function (codeType: string): Promise<void> {
	await this.verification.pull({ 'verification.codeType': codeType })
	await this.save()
}

// Create 2FA code
UserSchema.methods.create2FACode = async function (): Promise<UserDoc> {
	await this.delete2FACode()
	await this.createVerificationCode('twoFA')
	return this
}

// Nullify 2FA code
UserSchema.methods.delete2FACode = async function (): Promise<void> {
	await this.deleteVerificationCode('twoFA')
}

UserSchema.methods.createGoogleAuthVerificationCode = async function (data): Promise<void> {
	this.verification = []
	await this.verification.push({
		codeType: data.codeType,
		code: data.code,
		referenceCode: GenerateRandomStringOfLength(10),
	})
}

// Create 2FA code
UserSchema.methods.createGoogleAuthCode = async function (code: string): Promise<void> {
	// await this.delete2FACode()
	await this.createGoogleAuthVerificationCode({
		codeType: 'googleAuth',
		code,
	})
	// return this
}

// Nullify Google Auth code
UserSchema.methods.deleteGoogleAuthCode = async function (): Promise<void> {
	await this.deleteVerificationCode('googleAuth')
}

// Create Reset Password code
UserSchema.methods.createResetPasswordCode = async function (): Promise<void> {
	await this.deleteResetPasswordCode()
	await this.createVerificationCode('resetPassword')
}

// Nullify Reset Password code
UserSchema.methods.deleteResetPasswordCode = async function (): Promise<void> {
	await this.deleteVerificationCode('resetPassword')
}

// Create Forgot Password code
UserSchema.methods.createForgotPasswordCode = async function (): Promise<void> {
	await this.deleteResetPasswordCode()
	await this.createVerificationCode('forgotPassword')
}

// Nullify Forgot Password code
UserSchema.methods.deleteForgotPasswordCode = async function (): Promise<void> {
	await this.deleteVerificationCode('forgotPassword')
}

export const User = model<UserSchemaDoc, UserModel>('User', UserSchema)
