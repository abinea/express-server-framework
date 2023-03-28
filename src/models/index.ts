import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import Sequelize from "sequelize"
import configs from "./config.json"
import DB from "../types/model"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || "development"
// @ts-ignore
const config = configs[env]
const sequelize = config.url
	? new Sequelize.Sequelize(config.url, config)
	: new Sequelize.Sequelize(
			config.database,
			config.username,
			config.password,
			config
	  )

async function initModels() {
	const db = {} as DB

	const models = await Promise.all(
		fs
			.readdirSync(__dirname)
			.filter(
				(file) =>
					file.indexOf(".") !== 0 &&
					file !== basename &&
					file.slice(-3) === ".ts"
			)
			.map(async (file) => {
				const { default: cb } = await import(path.join(__dirname, file))
				const model = cb(sequelize, Sequelize.DataTypes)
				return {
					name: model.name as string,
					model: model as Sequelize.Model,
				}
			})
	)
	models.forEach(({ name, model }) => {
		db[name] = model
		if (db[name].associate) {
			db[name].associate(db)
		}
	})
	db.sequelize = sequelize
	db.Sequelize = Sequelize
	return db
}

export default await initModels()
