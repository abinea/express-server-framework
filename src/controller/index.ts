import { Router } from "express"
import shopController from "./shop"

export default async function initControllers() {
	const router = Router()
	router.use("/api/shop", await shopController())
	return router
}
