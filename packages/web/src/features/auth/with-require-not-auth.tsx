import { useRouter } from "next/router"
import React from "react"
import { useAuth } from "./auth-context"

export function withRequireNotAuth<P extends object>(
	Component: React.ComponentType<P>,
) {
	const WrappedComponent = (props: P) => {
		const auth = useAuth()
		const router = useRouter()

		if (!auth.canRenderUI) return <div>loading...</div>
		if (auth.isLoggedIn) return router.replace("/dashboard")
		return <Component {...props} />
	}

	return WrappedComponent
}
