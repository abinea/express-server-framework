import { Router } from "express"
import urlnormalizeMiddleware from "./urlnormalize"

export default function initMiddlewares() {
	const router = Router()
	router.use(urlnormalizeMiddleware())
	return router
}
