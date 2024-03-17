import { authRouter } from "./routers/auth"
import { fileRouter } from "./routers/file"
import { userRouter } from "./routers/user"
import { router } from "./trpc"

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	file: fileRouter,
})

export type AppRouter = typeof appRouter
