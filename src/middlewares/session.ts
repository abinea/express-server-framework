import session from "express-session"
import sessionSequelize from "connect-session-sequelize"
import db from "../models"

export default function sessionMiddleware(secret) {
	const SequelizeStore = sessionSequelize(session.Store)

	const store = new SequelizeStore({
		db: db.sequelize,
		tableName: "session",
	})

	return session({
		secret,
		cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
		store,
		resave: false,
		proxy: true,
		saveUninitialized: false,
	})
}
