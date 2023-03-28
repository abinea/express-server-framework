import { Router } from "express"
import urlnormalizeMiddleware from "./urlnormalize"
import cookieParser from "cookie-parser"
import sessionMiddleware from "./session"
import loginMiddleware from "./login"

const secret = "d41d8cd98f00b204e9800998ecf8427ea378d269"

export default async function initMiddlewares() {
	const router = Router()
	router.use(urlnormalizeMiddleware())
	router.use(cookieParser())
	router.use(sessionMiddleware(secret))
	router.use(loginMiddleware())
	return router
}
