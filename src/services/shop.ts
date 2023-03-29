import type {
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
import type { ShopModel } from "../types/model"
import db from "../models"

export class ShopService {
	async init() {}

	find: ServiceAPI<FindArgs, FindResult<ShopModel>> = async ({
		id,
		pageIndex = 0,
		pageSize = 10,
		logging,
	}) => {
		if (id) {
			return [await db.Shop.findByPk(id, { logging })]
		}
		return await db.Shop.findAll({
			offset: pageIndex * pageSize,
			limit: pageSize,
			logging,
		})
	}

	modify: ServiceAPI<ModifyArgs<ShopModel>, ModifyResult<ShopModel>> =
		async ({ id, values, logging }) => {
			const target = await db.Shop.findByPk(id)
			if (!target) {
				return null
			}
			Object.assign(target, values)
			return await target.save({ logging })
		}

	remove: ServiceAPI<RemoveArgs, RemoveResult> = async ({ id, logging }) => {
		const target = await db.Shop.findByPk(id, { logging })
		if (!target) {
			return false
		}
		return target.destroy({ logging })
	}
	create: ServiceAPI<CreateArgs<ShopModel>, CreateResult<ShopModel>> =
		async ({ values, logging }) => {
			return await db.Shop.create(values, { logging })
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
