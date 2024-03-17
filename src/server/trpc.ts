import { initTRPC, TRPCError } from "@trpc/server"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { isAfter } from "date-fns"
import { prisma } from "./prisma"

export async function createContext(options: CreateNextContextOptions) {
	const sessionToken = options.req.cookies["session"]

	return {
		sessionToken,
		request: options.req,
		response: options.res,
	}
}

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router

export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(async options => {
	const sessionToken = options.ctx.sessionToken
	const existingSession = await prisma.session.findFirst({
		where: { token: sessionToken },
	})

	const isUnauthorized =
		!existingSession || isAfter(new Date(), existingSession.expiresIn)

	if (isUnauthorized)
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "unauthorized request",
		})

	const existingUser = await prisma.user.findUnique({
		where: { id: existingSession.ownerId },
	})

	if (!existingUser)
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "target user not found",
		})

	return options.next({
		ctx: {
			...options.ctx,
			sessionToken: sessionToken as string,
			loggedUser: { ...existingUser },
		},
	})
})

export const adminProtectedProcedure = protectedProcedure.use(async options => {
	if (options.ctx.loggedUser.role !== "admin")
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "user not authorized",
		})

	return options.next()
})
