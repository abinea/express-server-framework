import { normalize } from "node:path"
import { parse, format } from "node:url"
import type { NextFunction, Request, Response } from "express"

export default function urlnormalizeMiddleware() {
	return (req: Request, res: Response, next: NextFunction) => {
		// 修复 Windows 和 Linux 系统使用 normalize 路径分隔符不一致的问题
		const pathname = normalize(req.path).split("\\").join("/")
		const urlParsed = parse(req.url)

		let shouldRedirect = false

		// 重定向不规范的路径
		if (req.path != pathname) {
			urlParsed.pathname = pathname
			shouldRedirect = true
		}

		// 执行重定向或者略过
		if (shouldRedirect) {
			res.redirect(format(urlParsed))
		} else {
			next()
		}
	}
}
