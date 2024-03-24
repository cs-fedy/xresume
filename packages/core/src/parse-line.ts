export type ParsedLine = {
	type: string
	content?: string
	name?: string
	options?: string
	arguments?: Array<string>
}

export function parseLine(line: string): Array<ParsedLine> {
	// Regular expression to match commands, options, arguments, and content
	const regex = /\\([a-zA-Z]+)(?:\[([^\]]*)])?(?:\{([^}]*)})*|([^\\]+)/g
	const matches = [...line.matchAll(regex)]

	return matches.map(match => {
		if (!match[1])
			// If content match is found
			return { type: "content", content: match[4] }
		const [_, name, options, rawArguments] = match

		// TODO: fix regex returns only one argument
		const argumentsArr = rawArguments
			? rawArguments.split("{}").filter(arg => arg !== "")
			: undefined

		return { type: "command", name, options, arguments: argumentsArr }
	})
}
