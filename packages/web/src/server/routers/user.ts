import { onboardingHandler, onboardingSchema } from "../handlers/onboarding"
import { protectedProcedure, router } from "../trpc"

export const userRouter = router({
	onboarding: protectedProcedure
		.input(onboardingSchema)
		.mutation(async ({ input, ctx }) =>
			onboardingHandler({ args: input, loggedUser: ctx.loggedUser }),
		),
})
