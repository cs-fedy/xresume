import { addDays } from "date-fns"
import { OAuth2Client } from "google-auth-library"
import * as crypto from "node:crypto"
import { prisma } from "../prisma"

type AuthHandlerResult =
	| {
			success: false
			code: string
			message: string
	  }
	| {
			success: true
			message: string
			payload: {
				sessionId: number
				sessionToken: string
				sessionExpiration: Date
			}
	  }

export async function authHandler(token: string): Promise<AuthHandlerResult> {
	try {
		const googleAuthClient = new OAuth2Client(
			process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		)

		const ticket = await googleAuthClient.verifyIdToken({
			idToken: token,
			audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
		})

		const payload = ticket.getPayload()
		if (!payload)
			return {
				success: false,
				code: "NOT_FOUND",
				message: "google_user_not_found",
			}

		const { email, name: fullName, picture: image } = payload

		const user = await prisma.user.upsert({
			where: { email },
			update: {},
			create: {
				email: email as string,
				fullName: fullName as string,
				profilePictureURL: image as string,
			},
		})

		const session = await prisma.session.create({
			data: {
				ownerId: user.id,
				token: crypto.randomBytes(12).toString("hex"),
				expiresIn: addDays(new Date(), 1),
			},
		})

		return {
			success: true,
			message: "authenticated successfully",
			payload: {
				sessionId: session.id,
				sessionToken: session.token,
				sessionExpiration: session.expiresIn,
			},
		}
	} catch (error) {
		return {
			success: false,
			code: "INTERNAL_SERVER_ERROR",
			message: "unexpected_error",
		}
	}
}
