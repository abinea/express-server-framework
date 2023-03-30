import Sequelize from "sequelize"

export interface ShopModel extends Sequelize.Model {
	id: number
	name: string
	hacked: boolean
	updated_at: Date
	created_at: Date
}

export interface ScheduleLockModel extends Sequelize.Model {
	id: number
	name: string
	counter: number
	updated_at: Date
	created_at: Date
}

export default interface DB {
	sequelize: Sequelize.Sequelize
	Sequelize: typeof Sequelize
	Shop: Sequelize.ModelStatic<ShopModel>
	ScheduleLock: Sequelize.ModelStatic<ScheduleLockModel>
	[key: string]: any
}
