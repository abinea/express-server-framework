import {
	CreateArgs,
	CreateResult,
	FindArgs,
	FindResult,
	ModifyArgs,
	ModifyResult,
	RemoveArgs,
	RemoveResult,
	ServiceAPI,
} from "../types/service"
import { ShopModel } from "../types/model"
import db from "../models"

export class ShopService {
	async init() {}

	find: ServiceAPI<FindArgs, FindResult<ShopModel>> = async ({
		id,
		pageIndex = 0,
		pageSize = 10,
	}) => {
		if (id) {
			return [await db.Shop.findByPk(id)]
		}
		return await db.Shop.findAll({
			offset: pageIndex * pageSize,
			limit: pageSize,
		})
	}

	modify: ServiceAPI<ModifyArgs<ShopModel>, ModifyResult<ShopModel>> =
		async ({ id, values }) => {
			const target = await db.Shop.findByPk(id)
			if (!target) {
				return null
			}
			Object.assign(target, values)
			return await target.save()
		}

	remove: ServiceAPI<RemoveArgs, RemoveResult> = async ({ id }) => {
		const target = await db.Shop.findByPk(id)
		if (!target) {
			return false
		}
		return target.destroy()
	}
	create: ServiceAPI<CreateArgs<ShopModel>, CreateResult<ShopModel>> =
		async ({ values }) => {
			const created = db.Shop.create(values)
			console.log(created)
			return await db.Shop.create(values)
		}
}

// 单例模式
let service: ShopService | null = null
export default async function () {
	if (!service) {
		service = new ShopService()
		await service.init()
	}
	return service
}
