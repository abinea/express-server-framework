import Sequelize, { Model } from "sequelize"
export default (
	sequelize: Sequelize.Sequelize,
	DataTypes: typeof Sequelize.DataTypes
) => {
	class scheduleLock extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models: any) {
			// define association here
		}
	}
	scheduleLock.init(
		{
			name: DataTypes.STRING,
			counter: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "ScheduleLock",
			tableName: "schedule_lock",
		}
	)
	return scheduleLock
}
