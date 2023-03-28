import { resolve } from "node:path"
import { promisify } from "node:util"
import process from "node:process"
import express, { NextFunction, Request, Response } from "express"
import type { Application } from "express"
import initMiddlewares from "./middlewares"
import initControllers from "./controller"

const server: Application = express()
const publicDir = resolve("public")

const PORT = parseInt(process.env.PORT as string) || 9000

async function bootstrap() {
	server.use(express.static(publicDir))
	server.use(await initMiddlewares())
	server.use(await initControllers())
	server.use(errorHandler)
	await promisify(server.listen.bind(server, PORT))()
	console.log(`> start server on port ${PORT}`)
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
	console.log("出现异常", err)
	res.redirect("/500.html")
}

// 监听未捕获的 Promise 异常，直接退出进程
process.on("unhandledRejection", (err) => {
	console.error("unhandledRejection", err)
	process.exit(1)
})

bootstrap()
