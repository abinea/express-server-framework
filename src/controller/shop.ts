// src/controllers/shop.js
import { Router } from "express"
import type { Request, Response } from "express"
import shopService, { ShopService } from "../services/shop"

interface ShopQuery {
	pageIndex: number
	pageSize: number
}

type ControllerMethod = (req: Request, res: Response) => Promise<void>

class ShopController {
	shopService: ShopService

	async init(): Promise<Router> {
		this.shopService = await shopService()
		const router = Router()
		router.get("/", this.getAll)
		router.get("/:shopId", this.getOne)
		router.put("/:shopId", this.put)
		router.delete("/:shopId", this.delete)
		return router
	}

	getAll = async (req: Request & { query: ShopQuery }, res: Response) => {
		const { pageIndex, pageSize } = req.query
		const shopList = await this.shopService.find({
			id: undefined,
			pageIndex,
			pageSize,
		})

		res.send({ success: true, data: shopList })
	}

	getOne: ControllerMethod = async (req, res) => {
		const { shopId } = req.params
		const shopList = await this.shopService.find({ id: shopId })

		if (shopList.length) {
			res.send({ success: true, data: shopList[0] })
		} else {
			res.status(404).send({ success: false, data: null })
		}
	}

	put: ControllerMethod = async (req, res) => {
		const { shopId } = req.params
		const { name } = req.query
		const shopInfo = await this.shopService.modify({
			id: shopId,
			values: { name },
		})

		if (shopInfo) {
			res.send({ success: true, data: shopInfo })
		} else {
			res.status(404).send({ success: false, data: null })
		}
	}

	delete: ControllerMethod = async (req, res) => {
		const { shopId } = req.params
		const success = await this.shopService.remove({ id: shopId })

		if (!success) {
			res.status(404)
		}
		res.send({ success })
	}
}

async function shopController() {
	const c = new ShopController()
	return await c.init()
}

export default shopController
