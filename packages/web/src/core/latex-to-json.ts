import fs from "node:fs"
import path from "node:path"

export function latexToJson(raw: string) {
	console.log(raw)
	return {}
}

const filePath = path.join(__dirname, "example.tex")
fs.readFile(filePath, (err, data) => {
	if (err) throw new Error("An error occurred while reading the file")
	const transformedData = latexToJson(data.toString())
})
