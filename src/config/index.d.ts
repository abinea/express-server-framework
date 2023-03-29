import type { ENV } from "../types"
import merge from "lodash.merge"
import logger, { logging } from "../utils/logger"

interface Config {
	default: {
		sessionCookieSecret: string
		sessionCookieMaxAge: number

		homepagePath: string
		loginPath: string
		loginWhiteList: {
			[key: string]: string[]
		}

		githubStrategyOptions: {
			clientID: string
			clientSecret: string
			callbackURL: string
		}

		db: {
			dialect: "sqlite" | "mysql" | "mariadb" | "postgres" | "mssql"
			storage: string
			benchmark: boolean
			logging: boolean | ((sql: string, timing?: number) => void)
			define: {
				underscored: boolean
			}
			migrationStorageTableName: string
		}
	}

	development: {
		db: {
			storage: string
		}
	}

	test: {
		db: {
			logging: boolean
		}
	}

	production: {
		sessionCookieMaxAge: number

		githubStrategyOptions: {
			callbackURL: string
		}

		db: {
			storage: string
		}
	}
}

declare const config: Config

export default merge(
	{},
	config.default,
	config[(process.env.NODE_ENV as ENV) || "development"]
)
