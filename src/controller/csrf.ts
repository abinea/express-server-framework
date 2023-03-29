import type { Handler } from "../types/controller"
import { Router } from "express"

class CsrfController {
	async init() {
		const router = Router()
		router.get("/script", this.getScript)
		return router
	}

	getScript: Handler = (req, res) => {
		res.type("js")
		res.send(`window.__CSRF_TOKEN__="${req.csrfToken()}";`)
	}
}

export default async () => {
	const c = new CsrfController()
	return c.init()
}
