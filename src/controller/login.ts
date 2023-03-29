import type { Handler } from "../types/controller"

import { Router } from "express"
import { passport } from "../middlewares/auth"

class LoginController {
	constructor(public homepagePath: string, public loginPath: string) {}
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
				failureRedirect: this.loginPath,
			}),
			this.getGithubCallback
		)
		return router
	}

	post: Handler = (req, res) => {
		// @ts-ignore
		req.session.logined = true
		res.redirect(this.homepagePath)
	}

	getGithubCallback: Handler = (req, res) => {
		// @ts-ignore
		req.session.logined = true
		res.redirect(this.homepagePath)
	}
}

export default async (homepagePath = "/", loginPath = "/login.html") => {
	const c = new LoginController(homepagePath, loginPath)
	return await c.init()
}
