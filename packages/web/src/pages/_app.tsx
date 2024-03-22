import { trpc } from "@/client"
import { AuthProvider } from "@/features/auth/auth-context"
import "@/styles/globals.css"
import type { AppProps } from "next/app"

function App({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	)
}

export default trpc.withTRPC(App)
