import { AppRouter } from "@/server"
import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"

function getBaseUrl() {
	if (typeof window !== "undefined") return ""
	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
	ssr: false,
	config: options => ({
		links: [
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`,
				headers: () => ({}),
			}),
		],
	}),
})
