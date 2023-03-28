import { Router } from "express"
import shopController from "./shop"
import chaosController from "./chaos"
import healthController from "./health"

export default async function initControllers() {
	const router = Router()
	router.use("/api/shop", await shopController())
	router.use("/api/chaos", await chaosController())
	router.use("/api/health", await healthController())
	return router
}
