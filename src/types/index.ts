import type Logger from "bunyan"
declare global {
	namespace Express {
		export interface Request {
			session: {
				logined: boolean
			}
			uuid: string
			logger: Logger
			loggerSql: Logger
			logging: (sql: string, timing?: number) => void
		}
	}
	namespace morgan {
		// function morgan(){
		//   [key: string]: TokenIndexer
		// }
	}
}

export type ENV = "development" | "test" | "production" | undefined
