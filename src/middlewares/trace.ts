import { v4 as uuid } from "uuid"
import morgan from "morgan"
import onFinished from "on-finished"
import logger, { logging } from "../utils/logger"
import type { Handler, TokenIndexer } from "../types/controller"

export default function traceMiddleware(): [Handler, Handler] {
	return [
		morgan("common", { skip: () => true }),
		(req, res, next) => {
			req.uuid = uuid()
			req.logger = logger.child({ uuid: req.uuid })
			req.loggerSql = req.logger.child({ type: "sql" })
			req.logging = logging(req.loggerSql, "info")

			onFinished(res, () => {
				const getToken = (token: string) => {
					const m: TokenIndexer = morgan as any
					return m[token](req, res, next)
				}
				const tokens = [
					"remote-addr",
					"method",
					"url",
					"http-version",
					"status",
					"response-time",
				].reduce(
					(acc: Record<string, string | null | undefined>, token) => {
						acc[token] = getToken(token)
						return acc
					},
					{}
				)

				req.logger.info({
					type: "res",
					...tokens,
				})
			})
			next()
		},
	]
}
