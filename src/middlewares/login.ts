import { parse } from "url"
import { Handler } from "../types/controller"

export default function loginMiddleware(
	homepagePath = "/",
	loginPath = "/login.html",
	whiteList: { [key: string]: string[] } = {
		"/500.html": ["get"],
		"/api/health": ["get"],
		"/api/login": ["post"],
		"/api/login/github": ["get"],
		"/api/login/github/callback": ["get"],
	}
): Handler {
	whiteList[loginPath] = ["get"]

	return (req, res, next) => {
		const pathname = parse(req.url).pathname as string

		if (req.session.logined && pathname == loginPath) {
			res.redirect(homepagePath)
			return
		}

		if (
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
