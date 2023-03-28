import Sequelize from "sequelize"

export interface ShopModel extends Sequelize.Model {
	id: number
	name: string
	updated_at: Date
	created_at: Date
}

export default interface DB {
	sequelize: Sequelize.Sequelize
	Sequelize: typeof Sequelize
	Shop: Sequelize.ModelStatic<ShopModel>
	[key: string]: any
}
