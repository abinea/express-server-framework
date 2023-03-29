import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { config } from "dotenv"

const dotenvTags = [
	// 本地环境
	"development",
	// 测试环境
	// 比如：单元测试
	"test",
	// 部署环境
	// 比如：日常、预发、线上
	"production",
]

if (!dotenvTags.includes(process.env.NODE_ENV as string)) {
	process.env.NODE_ENV = dotenvTags[0]
}
const dotenvPath = resolve(".env")

const dotenvFiles = [
	dotenvPath,
	`${dotenvPath}.local`,
	`${dotenvPath}.${process.env.NODE_ENV}`,
	`${dotenvPath}.${process.env.NODE_ENV}.local`,
].filter(existsSync)

dotenvFiles.reverse().forEach((dotenvFile) => config({ path: dotenvFile }))
