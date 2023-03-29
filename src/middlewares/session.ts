import session from "express-session"
import sessionSequelize from "connect-session-sequelize"
import db from "../models"
import config from "../config"

export default function sessionMiddleware() {
	const SequelizeStore = sessionSequelize(session.Store)

	const store = new SequelizeStore({
		db: db.sequelize,
		tableName: "session",
	})

	return session({
		secret: config.sessionCookieSecret,
		cookie: { maxAge: config.sessionCookieMaxAge },
		store,
		resave: false,
		proxy: true,
		saveUninitialized: false,
	})
}
