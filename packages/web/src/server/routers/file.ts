import {
	experimental_createMemoryUploadHandler as createMemoryUploadHandler,
	experimental_parseMultipartFormData as parseMultipartFormData,
} from "@trpc/server/adapters/node-http/content-type/form-data"
import { v2 as cloudinary } from "cloudinary"
import { zfd } from "zod-form-data"
import { protectedProcedure, router } from "../trpc"

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

function uploadStreamAsync(stream: ReadableStream) {
	return new Promise((resolve: (url: string) => void, reject) => {
		cloudinary.uploader.upload_stream(stream, (err, result) => {
			if (err) return reject(err)
			return resolve(result?.url ?? "")
		})
	})
}

export const fileRouter = router({
	upload: protectedProcedure
		.use(async opts => {
			const formData = await parseMultipartFormData(
				opts.ctx.request,
				createMemoryUploadHandler(),
			)

			return opts.next({ getRawInput: async () => ({ formData }) })
		})
		.input(zfd.formData({ file: zfd.file() }))
		.mutation(async options => {
			try {
				const uploadedFileURL = await uploadStreamAsync(
					options.input.file.stream(),
				)

				return {
					success: true,
					data: { url: uploadedFileURL },
				}
			} catch (error) {
				return {
					success: false,
					code: "INTERNAL_SERVER_ERROR",
					message: "unexpected_error",
				}
			}
		}),
})
