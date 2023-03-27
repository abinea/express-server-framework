import { resolve } from "node:path"
import { promisify } from "node:util"
import express from "express"
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
	await promisify(server.listen.bind(server, PORT))()
	console.log(`> start server on port ${PORT}`)
}

bootstrap()
