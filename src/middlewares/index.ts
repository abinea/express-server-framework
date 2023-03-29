import { Router } from "express"
import bodyParser from "body-parser"
import csurf from "csurf"
import helmet from "helmet"
import config from "../config"
import urlnormalizeMiddleware from "./urlnormalize"
import cookieParser from "cookie-parser"
import sessionMiddleware from "./session"
import loginMiddleware from "./login"
import authMiddleware from "./auth"
import traceMiddleware from "./trace"

// const secret = "d41d8cd98f00b204e9800998ecf8427ea378d269"

export default async function initMiddlewares() {
	const router = Router()
	router.use(traceMiddleware())
	// 通过 HTTP 响应头来控制安全策略
	router.use(
		helmet(),
		helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: [
					"'nonce-b83c6f08d133077bcb793130a0cd4deb'",
					"'nonce-2866875352ca84f8bd4356e2bc11ce29'",
					"'nonce-d41d8cd98f00b204e9800998ecf8427e'",
				],
			},
		})
	)
	// 修正 URL，如 /api//login => /api/login
	router.use(urlnormalizeMiddleware())
	// 会话管理
	router.use(cookieParser(config.sessionCookieSecret))
	router.use(sessionMiddleware())
	// 权限限制
	router.use(loginMiddleware())
	// 身份验证 OAuth
	router.use(authMiddleware())
	// 跨域伪造请求攻击防护
	router.use(bodyParser.urlencoded({ extended: false }), csurf())
	return router
}
