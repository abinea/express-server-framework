import type { Handler } from "../types/controller"
import { Router } from "express"

class HealthController {
	async init() {
		const router = Router()
		router.get("/", this.get)
		return router
	}

	get: Handler = (req, res) => {
		res.send({})
	}
}

export default async () => {
	const c = new HealthController()
	return await c.init()
}
