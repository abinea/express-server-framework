import { Router } from "express"
import type { Request, Response } from "express"
import shopService, { ShopService } from "../services/shop"
import { createShopFormSchema } from "../moulds/ShopForm"
import bodyParser from "body-parser"

interface ShopQuery {
	pageIndex: number
	pageSize: number
}

type API<Params = {}, Body = {}, Query = {}, Res = unknown> = (
	req: Request<Params, {}, Body, Query>,
	res: Res & Omit<Response, "body">
) => Promise<void>

class ShopController {
	shopService: ShopService

	async init(): Promise<Router> {
		this.shopService = await shopService()
		const router = Router()
		router.get("/", this.getAll)
		router.get("/:shopId", this.getOne)
		router.put("/:shopId", this.put)
		router.delete("/:shopId", this.delete)
		router.post("/", bodyParser.urlencoded({ extended: false }), this.post)
		return router
	}

	getAll: API<{}, {}, ShopQuery> = async (req, res) => {
		const { pageIndex, pageSize } = req.query
		const shopList = await this.shopService.find({
			id: undefined,
			pageIndex,
			pageSize,
		})

		res.send({ success: true, data: shopList })
	}

	getOne: API<{ shopId: string }> = async (req, res) => {
		const { shopId } = req.params
		const shopList = await this.shopService.find({ id: shopId })

		if (shopList.length) {
			res.send({ success: true, data: shopList[0] })
		} else {
			res.status(404).send({ success: false, data: null })
		}
	}

	put: API<{ shopId: string }, {}, { name: string }> = async (req, res) => {
		const { shopId } = req.params
		const { name } = req.query
		console.log(req.params, req.query)
		try {
			await createShopFormSchema().validate({ name })
		} catch (e) {
			res.status(400).send({ success: false, message: e.message })
			return
		}

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

	delete: API<{ shopId: string }> = async (req, res) => {
		const { shopId } = req.params
		const success = await this.shopService.remove({ id: shopId })

		if (!success) {
			res.status(404)
		}
		res.send({ success })
	}

	post: API<{}, { name: string }> = async (req, res) => {
		const { name } = req.body
		try {
			await createShopFormSchema().validate({ name })
		} catch (e) {
			res.status(400).send({ success: false, message: e.message })
			return
		}
		const shopInfo = await this.shopService.create({ values: { name } })
		res.send({ success: true, data: shopInfo })
	}
}

async function shopController() {
	const c = new ShopController()
	return await c.init()
}

export default shopController
