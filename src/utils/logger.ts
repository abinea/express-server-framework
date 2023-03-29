import type { LogLevel } from "bunyan"
import bunyan from "bunyan"
import { name } from "../../package.json"

type Outpout = {
	type: string
	transaction?: string
	statement?: string
	elapsedTime?: number
}

const logger = bunyan.createLogger({
	name,
	level: (process.env.LOG_LEVEL || "debug").toLowerCase() as LogLevel,
})

const LOGGING_REGEXP = /^Executed\s+\((.+)\):\s+(.+)/

function logging(logger: bunyan, level = "trace") {
	return (m: string, t: any) => {
		const o: Outpout = { type: "sql" }

		const match = m.match(LOGGING_REGEXP)
		if (match) {
			o.transaction = match[1]
			o.statement = match[2]
		} else {
			o.statement = m
		}

		if (typeof t == "number") o.elapsedTime = t
		// @ts-ignore
		logger[level](o)
	}
}

export { logger as default, logging }
