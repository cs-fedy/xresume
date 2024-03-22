import { authRouter } from "./routers/auth"
import { fileRouter } from "./routers/file"
import { templateRouter } from "./routers/template"
import { userRouter } from "./routers/user"
import { router } from "./trpc"

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	file: fileRouter,
	template: templateRouter,
})

export type AppRouter = typeof appRouter
