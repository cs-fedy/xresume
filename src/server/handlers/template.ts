import { User } from "@prisma/client"
import { z } from "zod"
import { prisma } from "../prisma"

export const createTemplateSchema = z.object({
	templateURL: z.string().url(),
	isPublic: z.boolean().optional(),
	name: z.string(),
	description: z.string(),
	keywords: z.string(),
	category: z.enum([
		"european",
		"american",
		"academic",
		"creative",
		"technical",
		"executive",
		"entry-level",
		"functional",
		"combination",
	]),
})

type CreateCategoryHandlerArgs = { args: z.infer<typeof createTemplateSchema> }

export async function createTemplateHandler({
	args,
}: CreateCategoryHandlerArgs) {
	await prisma.template.create({ data: args })
	return { success: true, message: "template created successfully" }
}

type listTemplatesArgs = { loggedUser: User }
export async function listTemplates({ loggedUser }: listTemplatesArgs) {
	return {
		success: true,
		data: {
			templates: await prisma.template.findMany({
				where: loggedUser.role === "admin" ? {} : { isPublic: true },
			}),
		},
	}
}

export const updateTemplateSchema = z.object({
	templateId: z.number(),
	data: z.object({
		templateURL: z.string().url().optional(),
		isPublic: z.boolean().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		keywords: z.string().optional(),
		category: z
			.enum([
				"european",
				"american",
				"academic",
				"creative",
				"technical",
				"executive",
				"entry-level",
				"functional",
				"combination",
			])
			.optional(),
	}),
})

type UpdateTemplateArgs = { args: z.infer<typeof updateTemplateSchema> }
export async function updateTemplateHandler({ args }: UpdateTemplateArgs) {
	const existingTemplate = await prisma.template.findUnique({
		where: { id: args.templateId },
	})

	if (!existingTemplate)
		return {
			success: false,
			code: "NOT_FOUND",
			message: "target template not found",
		}

	await prisma.template.update({
		where: { id: args.templateId },
		data: { ...args.data },
	})

	return {
		success: true,
		message: "template updated successfully",
	}
}

type GetTemplateArgs = {
	loggedUser: User
	templateId: number
}

export async function getTemplateHandler({
	loggedUser,
	templateId,
}: GetTemplateArgs) {
	const existingTemplate = await prisma.template.findUnique({
		where: { id: templateId },
	})

	if (
		!existingTemplate ||
		(!existingTemplate.isPublic && loggedUser.role === "user")
	)
		return {
			success: false,
			code: "NOT_FOUND",
			message: "target template not found",
		}

	return {
		success: true,
		data: { template: existingTemplate },
	}
}

type DeleteTemplateHandlerArgs = { templateId: number }
export async function deleteTemplateHandler({
	templateId,
}: DeleteTemplateHandlerArgs) {
	const existingTemplate = await prisma.template.findUnique({
		where: { id: templateId },
	})

	if (!existingTemplate)
		return {
			success: false,
			code: "NOT_FOUND",
			message: "target template not found",
		}

	await prisma.template.delete({ where: { id: templateId } })
	return { success: true, message: "template deleted successfully" }
}
