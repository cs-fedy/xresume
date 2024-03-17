import { prisma } from "../prisma"

export async function logoutHandler(sessionToken: string) {
	await prisma.session.deleteMany({ where: { token: sessionToken } })
	return { success: true, message: "session deleted successfully" }
}
