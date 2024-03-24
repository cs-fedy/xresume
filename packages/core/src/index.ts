import fs from "node:fs"
import path from "node:path"
import { Latex } from "./latex-to-json"

const filePath = path.join(__dirname, "../example.tex")
fs.readFile(filePath, (err, data) => {
	if (err) throw new Error("An error occurred while reading the file")
	const transformedData = Latex.parse(data.toString())
	console.log(transformedData)
})
