import express from "express"
import type { Application } from "express"
import { resolve } from "path"
import { promisify } from "util"

const server: Application = express()
const publicDir = resolve("public")

const PORT = parseInt(process.env.PORT as string) || 9000

async function bootstrap() {
	server.use(express.static(publicDir))
	await promisify(server.listen.bind(server, PORT))()
	console.log(`> start server on port ${PORT}`)
}

bootstrap()
