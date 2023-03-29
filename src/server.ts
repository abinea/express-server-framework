import type { Application, NextFunction, Request, Response } from "express"

import { resolve } from "node:path"
import { promisify } from "node:util"
import process from "node:process"

import express from "express"
import initMiddlewares from "./middlewares"
import initControllers from "./controller"

const server: Application = express()
const publicDir = resolve("public")
const mouldsDir = resolve("src/moulds")
const port = parseInt(process.env.PORT as string) || 3000

async function bootstrap() {
	// 注册中间件
	server.use(await initMiddlewares())
	// 静态文件
	server.use(express.static(publicDir))
	server.use("/moulds", express.static(mouldsDir))
	// 注册控制层
	server.use(await initControllers())
	// 错误处理
	server.use(errorHandler)

	await promisify(server.listen.bind(server, port))()
	console.log(`> start server on port ${port}`)
}

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(err)
	}
	console.log("出现异常：", err)
	res.redirect("/500.html")
}

// 监听未捕获的 Promise 异常，直接退出进程
process.on("unhandledRejection", (err) => {
	console.error("unhandledRejection", err)
	process.exit(1)
})

bootstrap()
