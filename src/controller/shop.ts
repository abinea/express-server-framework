import { Router } from "express"
import shopService, { ShopService } from "../services/shop"
import { createShopFormSchema } from "../moulds/ShopForm"
import { ControllerAPI } from "../types/controller"
import cc from "../utils/cc"
import escapeHtmlInObject from "../utils/escape-html-in-object"
import bodyParser from "body-parser"

interface ShopQuery {
	pageIndex: number
	pageSize: number
}

class ShopController {
	shopService = {} as ShopService

	async init(): Promise<Router> {
		this.shopService = await shopService()
		const router = Router()
		router.get("/", cc(this.getAll))
		router.get("/:shopId", cc(this.getOne))
		router.put("/:shopId", cc(this.put))
		router.delete("/:shopId", cc(this.delete))
		router.post(
			"/",
			bodyParser.urlencoded({ extended: false }),
			cc(this.post)
		)
		return router
	}

	getAll: ControllerAPI<{}, {}, ShopQuery> = async (req, res) => {
		const { pageIndex, pageSize } = req.query
		const shopList = await this.shopService.find({
			id: undefined,
			pageIndex,
			pageSize,
		})
		res.send(escapeHtmlInObject({ success: true, data: shopList }))
	}

	getOne: ControllerAPI<{ shopId: string }> = async (req, res) => {
		const { shopId } = req.params
		const shopList = await this.shopService.find({ id: shopId })

		if (shopList.length) {
			res.send(escapeHtmlInObject({ success: true, data: shopList[0] }))
		} else {
			res.status(404).send({ success: false, data: null })
		}
	}

	put: ControllerAPI<{ shopId: string }, {}, { name: string }> = async (
		req,
		res
	) => {
		const { shopId } = req.params
		const { name } = req.query
		console.log(req.params, req.query)
		try {
			await createShopFormSchema().validate({ name })
		} catch (e: any) {
			res.status(400).send({ success: false, message: e.message })
			return
		}

		const shopInfo = await this.shopService.modify({
			id: shopId,
			values: { name },
		})

		if (shopInfo) {
			res.send(escapeHtmlInObject({ success: true, data: shopInfo }))
		} else {
			res.status(404).send({ success: false, data: null })
		}
	}

	delete: ControllerAPI<{ shopId: string }> = async (req, res) => {
		const { shopId } = req.params
		const success = await this.shopService.remove({ id: shopId })

		if (!success) {
			res.status(404)
		}
		res.send({ success })
	}

	post: ControllerAPI<{}, { name: string }> = async (req, res) => {
		const { name } = req.body
		try {
			await createShopFormSchema().validate({ name })
		} catch (e: any) {
			res.status(400).send({ success: false, message: e.message })
			return
		}
		const shopInfo = await this.shopService.create({ values: { name } })
		res.send(escapeHtmlInObject({ success: true, data: shopInfo }))
	}
}

export default async () => {
	const c = new ShopController()
	return await c.init()
}
