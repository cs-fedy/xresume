import { trpc } from "@/client"
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"

type AuthStore = {
	isLoggedIn: boolean
	canRenderUI: boolean
	authHandler: (token: string) => void
	logoutHandler: () => void
}

const AuthContext = createContext({
	isLoggedIn: false,
	canRenderUI: false,
	authHandler: token => {
		throw new Error("must be implemented")
	},
	logoutHandler: () => {
		throw new Error("must be implemented")
	},
} as AuthStore)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [isLoggedIn, setLoggedIn] = useState(false)
	const [canRenderUI, setCanRenderUI] = useState(true)

	useEffect(() => {}, [])

	const handleAuthMutation = trpc.auth.login.useMutation()
	const handleLogoutMutation = trpc.auth.logout.useMutation()

	const store = useMemo(
		() => ({
			isLoggedIn,
			canRenderUI,
			authHandler: (token: string) =>
				handleAuthMutation.mutate(
					{ token },
					{
						onSuccess: data => {
							setLoggedIn(true)
							setCanRenderUI(true)
						},
						onError: error => {
							setLoggedIn(false)
							setCanRenderUI(true)
						},
					},
				),
			logoutHandler: () => {
				setCanRenderUI(false)
				handleLogoutMutation.mutate(
					{},
					{
						onSuccess: data => {
							setLoggedIn(false)
							setCanRenderUI(true)
						},
					},
				)
			},
		}),
		[canRenderUI, handleAuthMutation, handleLogoutMutation, isLoggedIn],
	)

	return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}
