import type { Handler } from "../types/controller"
import { parse } from "url"
import config from "../config"

const homepagePath = "/"
const loginPath = "/login.html"

const whiteList: { [key: string]: string[] } = Object.assign(
	{},
	config.loginWhiteList,
	{
		[loginPath]: ["get"],
	}
)

export default function loginMiddleware(): Handler {
	return (req, res, next) => {
		const pathname = parse(req.url).pathname as string

		// @ts-ignore
		if (req.session.logined && pathname == loginPath) {
			res.redirect(homepagePath)
			return
		}

		if (
			// @ts-ignore
			req.session.logined ||
			(whiteList[pathname] &&
				whiteList[pathname].includes(req.method.toLowerCase()))
		) {
			next()
			return
		}

		res.redirect(loginPath)
	}
}
