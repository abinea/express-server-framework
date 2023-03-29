import { Router } from "express"
import shopController from "./shop"
import chaosController from "./chaos"
import healthController from "./health"
import loginController from "./login"
import csrfController from "./csrf"

export default async function initControllers() {
	const router = Router()
	router.use("/api/csrf", await csrfController())
	router.use("/api/shop", await shopController())
	router.use("/api/chaos", await chaosController())
	router.use("/api/health", await healthController())
	router.use("/api/login", await loginController())
	return router
}
