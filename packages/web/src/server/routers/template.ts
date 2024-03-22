import { TRPCError } from "@trpc/server"
import { z } from "zod"
import {
	createTemplateHandler,
	createTemplateSchema,
	deleteTemplateHandler,
	getTemplateHandler,
	listTemplates,
	updateTemplateHandler,
	updateTemplateSchema,
} from "../handlers/template"
import { adminProtectedProcedure, protectedProcedure, router } from "../trpc"

export const templateRouter = router({
	create: adminProtectedProcedure
		.input(createTemplateSchema)
		.mutation(async ({ input }) => createTemplateHandler({ args: input })),

	updateById: adminProtectedProcedure
		.input(updateTemplateSchema)
		.mutation(async ({ input }) => {
			const updatedTemplate = await updateTemplateHandler({ args: input })

			if (!updatedTemplate.success)
				throw new TRPCError({
					code: updatedTemplate.code as any,
					message: updatedTemplate.message,
				})

			return { ...updatedTemplate }
		}),

	deleteById: adminProtectedProcedure
		.input(z.object({ templateId: z.number() }))
		.mutation(async ({ input: { templateId } }) => {
			const deletedTemplate = await deleteTemplateHandler({ templateId })

			if (!deletedTemplate.success)
				throw new TRPCError({
					code: deletedTemplate.code as any,
					message: deletedTemplate.message,
				})

			return { ...deletedTemplate }
		}),

	list: protectedProcedure.query(({ ctx: { loggedUser } }) =>
		listTemplates({ loggedUser }),
	),

	getById: protectedProcedure
		.input(z.object({ templateId: z.number() }))
		.query(async ({ input: { templateId }, ctx: { loggedUser } }) => {
			const getTemplateResult = await getTemplateHandler({
				templateId,
				loggedUser,
			})

			if (!getTemplateResult.success)
				throw new TRPCError({
					code: getTemplateResult.code as any,
					message: getTemplateResult.message,
				})

			return { ...getTemplateResult }
		}),
})
