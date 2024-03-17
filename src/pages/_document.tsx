import { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"

export default function Document() {
	return (
		<Html lang='en'>
			<Head />
			<body>
				<Main />
				<NextScript />
				<Script
					src='https://accounts.google.com/gsi/client'
					strategy='beforeInteractive'
				/>
			</body>
		</Html>
	)
}
