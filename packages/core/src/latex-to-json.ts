import { parseLine } from "./parse-line"

export class Latex {
	static parse(input: string): Latex {
		const parsedContent = input
			.split("\n")
			.map(line => line.trim())
			.filter(line => line.length !== 0)
			.map(parseLine)
			.flat()

		console.log(parsedContent)
		return new Latex()
	}

	private Latex() {}
}
