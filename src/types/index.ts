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
	// namespace morgan {
	//   function morgan{
	//     (format: string, options?: Options): Handler
	//   }
	// }
}

export type ENV = "development" | "test" | "production" | undefined

type PromiseType<T> = (args: any[]) => Promise<T>
export type UnPromisify<T> = T extends PromiseType<infer U> ? U : never

export * from "./controller"
export * from "./service"
export * from "./model"
