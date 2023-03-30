import { createTransport } from "nodemailer"
import { promisify } from "node:util"
import logger from "../utils/logger"
import config from "../config"

const { mailerOptions } = config
class MailService {
	mailer = {} as any
	async init() {
		this.mailer = createTransport(
			Object.assign(
				{ logger: logger.child({ type: "mail" }) },
				mailerOptions,
				{}
			)
		)
		await promisify(this.mailer.verify)()
	}

	async sendMail(params: any) {
		return await this.mailer.sendMail({
			from: mailerOptions.auth.user,
			...params,
		})
	}
}

let service: MailService
export default async () => {
	if (!service) {
		service = new MailService()
		await service.init()
	}
	return service
}
