import fs from "node:fs"
import path from "node:path"
import { Latex } from "./latex-to-json"

const filePath = path.join(__dirname, "../example.tex")
fs.readFile(filePath, (err, data) => {
	if (err) throw new Error("An error occurred while reading the file")
	const transformer = Latex.parse(data.toString())
	const transformedData = transformer.getParsedTex()

	const targetFile = path.join(__dirname, "../result.json")
	fs.writeFile(targetFile, JSON.stringify(transformedData), err => {
		if (err) throw new Error("An error occurred while reading the file")
	})
})
