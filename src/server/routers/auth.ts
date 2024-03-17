import { sessionTokenCookieOptions } from "@/utils/cookies"
import { TRPCError } from "@trpc/server"
import cookie from "cookie"
import { z } from "zod"
import { authHandler } from "../handlers/auth"
import { logoutHandler } from "../handlers/logout"
import { protectedProcedure, publicProcedure, router } from "../trpc"

const loginSchema = z.object({
	token: z.string(),
})

export const authRouter = router({
	login: publicProcedure
		.input(loginSchema)
		.mutation(async ({ input: { token }, ctx }) => {
			const authPayload = await authHandler(token)
			if (!authPayload.success)
				throw new TRPCError({
					code: authPayload.code as any,
					message: authPayload.message,
				})

			ctx.response.setHeader(
				"Set-cookie",
				cookie.serialize(
					"session",
					authPayload.payload.sessionToken,
					sessionTokenCookieOptions,
				),
			)
		}),
	logout: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {
		const logoutPayload = await logoutHandler(ctx.sessionToken)
		if (!logoutPayload.success)
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "an unexpected error happened while logging out",
			})

		ctx.response.setHeader(
			"Set-Header",
			cookie.serialize("session", "", {
				...sessionTokenCookieOptions,
				expires: new Date(),
			}),
		)

		return { success: true, message: "logged out successfully" }
	}),
})
