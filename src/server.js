const express = require("express")
const { resolve } = require("path")
const { promisify } = require("util")

const server = express()
const public = resolve("public")

const PORT = parseInt(process.env.PORT) || 9000

async function bootstrap() {
	server.use(express.static(public))
	await promisify(server.listen.bind(server, PORT))()
	console.log(`> start server on port ${PORT}`)
}

bootstrap()
