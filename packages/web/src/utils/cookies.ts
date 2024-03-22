export const sessionTokenCookieOptions = {
	domain: process.env.BASE_URL?.split("//")[1].split(":")[0],
	secure: !!process.env.BASE_URL?.includes("https"),
	httpOnly: true,
	path: "/",
	sameSite: false,
}
