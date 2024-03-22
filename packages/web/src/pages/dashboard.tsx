import { useAuth } from "@/features/auth/auth-context"
import { withRequireAuth } from "@/features/auth/with-require-auth"

function DashboardPage() {
	const auth = useAuth()

	return (
		<div className='h-screen w-screen items-center justify-center'>
			<button
				type='button'
				onClick={() => auth.logoutHandler()}
				className='rounded-lg bg-gray-800 px-8 py-2 text-sm text-gray-50 '>
				logout
			</button>
		</div>
	)
}

export default withRequireAuth(DashboardPage)
