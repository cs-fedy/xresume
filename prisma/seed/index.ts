import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
async function main() {
	await prisma.user.create({
		data: {
			role: "admin",
			fullName: "Fedi Abdouli",
			phoneNumber: "+21658828919",
			email: "fedi.abd01@gmail.com",
			isFirstTime: false,
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
