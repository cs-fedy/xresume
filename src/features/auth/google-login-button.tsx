import { useEffect } from "react"
import { useAuth } from "./auth-context"

export function GoogleLoginButton() {
	const auth = useAuth()

	useEffect(() => {
		const { google } = window as any
		if (google) {
			google.accounts.id.initialize({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
				callback: async (response: any) => {
					const token = response.credential
					auth.authHandler(token)
				},
			})

			const width = window.innerWidth > 400 ? 330 : window.innerWidth - 50
			google.accounts.id.renderButton(
				document.getElementById("google-sso-pl"),
				{
					size: "large",
					type: "standard",
					theme: "outline",
					width: `${width}px`,
					text: "continue_with",
					logo_alignment: "center",
				},
			)
		}
	}, [auth])

	return <div id='google-sso-pl' />
}
