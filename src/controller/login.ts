import type { Handler } from "../types/controller"
import { Router } from "express"
import { passport } from "../middlewares/auth"
import config from "../config"

const { homepagePath, loginPath } = config
class LoginController {
	async init() {
		const router = Router()
		router.post("/", this.post)
		router.get(
			"/github",
			passport.authenticate("github", { scope: ["read:user"] })
		)
		router.get(
			"/github/callback",
			passport.authenticate("github", {
				failureRedirect: loginPath,
			}),
			this.getGithubCallback
		)
		return router
	}

	post: Handler = (req, res) => {
		req.session.logined = true
		res.redirect(homepagePath)
	}

	getGithubCallback: Handler = (req, res) => {
		// @ts-ignore
		req.session.logined = true
		res.redirect(homepagePath)
	}
}

export default async () => {
	const c = new LoginController()
	return await c.init()
}
