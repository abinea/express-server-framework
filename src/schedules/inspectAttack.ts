import type { ScheduleLockModel, ShopModel, UnPromisify } from "../types"
import path from "node:path"
import { fileURLToPath } from "node:url"
import schedule from "node-schedule"
import db from "../models"
import { mailService, shopService } from "../services"
import { logger, escapeHtmlInObject } from "../utils"
import config from "../config"

const { sequelize, ScheduleLock, Shop, Sequelize } = db
const { Op } = Sequelize

// 当前任务的锁名称
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOCK_NAME = path.basename(__dirname)
// 锁的最长占用时间 15min
const LOCK_TIMEOUT = 15 * 60 * 1000
// 分布式任务并发数
const CONCURRENCY = 1
// 报警邮件发送对象
const MAIL_RECEIVER = config.mailerOptions.auth.user

class InspectAttack {
	mailService = {} as UnPromisify<typeof mailService>
	shopService = {} as UnPromisify<typeof shopService>

	async init() {
		this.mailService = await mailService()
		this.shopService = await shopService()

		// 每15min巡检一次
		schedule.scheduleJob(
			"*/15 * * * *",
			this.findAttackedShopInfoAndSendMail
		)
	}

	findAttackedShopInfoAndSendMail = async () => {
		logger.info({ type: "schedule", name: LOCK_NAME, msg: "start" })
		// 上锁
		const lockUpT = await sequelize.transaction()
		try {
			const [lock] = await ScheduleLock.findOrCreate({
				where: { name: LOCK_NAME },
				defaults: { name: LOCK_NAME, counter: 0 },
				transaction: lockUpT,
			})

			if (lock.counter >= CONCURRENCY) {
				if (Date.now() - lock["updated_at"].valueOf() > LOCK_TIMEOUT) {
					lock.counter--
					await lock.save({ transaction: lockUpT })
				}
				await lockUpT.commit()
				return
			}

			lock.counter++
			await lock.save({ transaction: lockUpT })
			await lockUpT.commit()
		} catch (err) {
			logger.error(err)
			await lockUpT.rollback()
			return
		}

		try {
			// 寻找异常数据
			const shops = (await this.shopService.find({
				pageSize: 100,
				where: {
					name: {
						[Op.or]: [{ [Op.like]: "<%" }, { [Op.like]: "%>" }],
					},
					hacked: false,
				},
			})) as ShopModel[]

			// 发送报警邮件
			if (shops.length) {
				const subject = "安全警告，发现可疑店铺信息！"
				const html = `
  <div>以下是服务器巡检发现的疑似含有网络攻击的店铺信息：</div>
  <pre>
  ${shops
		.map((shop) => JSON.stringify(escapeHtmlInObject(shop), null, 2))
		.join("\n")}
  </pre>`
				await this.mailService.sendMail({
					to: MAIL_RECEIVER,
					subject,
					html,
				})

				await Shop.update(
					{ hacked: true },
					{
						where: {
							id: {
								[Op.in]: shops.map((shop) => shop.id),
							},
						},
					}
				)
			}
		} catch {}

		// 解锁
		const lockDownT = await sequelize.transaction()
		try {
			const lock = (await ScheduleLock.findOne({
				where: { name: LOCK_NAME },
				transaction: lockDownT,
			})) as ScheduleLockModel
			if (lock.counter > 0) {
				lock.counter--
				await lock.save({ transaction: lockDownT })
			}
			await lockDownT.commit()
		} catch {
			await lockDownT.rollback()
		}
	}
}

export default async () => {
	const s = new InspectAttack()
	await s.init()
}
