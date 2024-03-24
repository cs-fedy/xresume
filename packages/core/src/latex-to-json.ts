import { ParsedLine, parseLine } from "./parse-line"

type Config = {
	commandName: string
	options?: string
	arguments?: Array<string>
}

type NewBlock = {
	endOfBlockIndex: number
	content: any
}

const configCommands = ["documentclass", "usepackage", "setlength"]

export class Latex {
	private config: Array<Config> = []
	private content: Array<any> = []

	private constructor(parsedTex: Array<ParsedLine>) {
		let currentIndex = 0
		while (currentIndex < parsedTex.length) {
			const currentLine = parsedTex[currentIndex]
			if (currentLine.type === "command" && currentLine.name) {
				if (configCommands.includes(currentLine.name)) {
					// handle config command
					this.config.push({
						commandName: currentLine.name,
						options: currentLine.options,
						arguments: currentLine.arguments,
					})
				} else if (["begin", "end"].includes(currentLine.name)) {
					// handle new block
					const newBlockResult = this.handleNewBlock(parsedTex, currentIndex)
					currentIndex = newBlockResult.endOfBlockIndex
					this.content.push(newBlockResult.content)
				} else {
					// handle normal command
					this.content.push({
						commandName: currentLine.name,
						options: currentLine.options,
						arguments: currentLine.arguments,
					})
				}
			} else if (currentLine.type === "content" && currentLine.content)
				this.content.push(currentLine.content)

			currentIndex++
		}
	}

	static parse(input: string): Latex {
		const parsedContent = input
			.split("\n")
			.map(line => line.trim())
			.filter(line => line.length !== 0)
			.map(parseLine)
			.flat()

		return new Latex(parsedContent)
	}

	public getParsedTex() {
		return { config: this.config, content: this.content }
	}

	private handleNewBlock(
		lines: Array<ParsedLine>,
		newBlockIndex: number,
	): NewBlock {
		const content = [] as Array<any>
		let currentIndex = newBlockIndex + 1

		while (currentIndex < lines.length && lines[currentIndex].name !== "end") {
			const currentLine = lines[currentIndex]

			if (currentLine.type !== "command" || currentLine.name !== "begin") {
				content.push(currentLine)
				currentIndex++
			} else {
				const newBlockResult = this.handleNewBlock(lines, currentIndex)
				currentIndex = newBlockResult.endOfBlockIndex
				this.content.push(newBlockResult.content)
			}
		}

		return { endOfBlockIndex: currentIndex, content }
	}
}
