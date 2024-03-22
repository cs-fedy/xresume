import { GoogleLoginButton } from "@/features/auth/google-login-button"
import { withRequireNotAuth } from "@/features/auth/with-require-not-auth"

function LoginPage() {
	return (
		<div className='h-screen w-screen items-center justify-center'>
			<GoogleLoginButton />
		</div>
	)
}

export default withRequireNotAuth(LoginPage)
