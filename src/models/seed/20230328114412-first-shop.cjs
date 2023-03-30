"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert("shop", [
			{
				name: "良品铺子",
				created_at: new Date(),
				updated_at: new Date(),
				hacked: false,
			},
			{
				name: "来伊份",
				created_at: new Date(),
				updated_at: new Date(),
				hacked: false,
			},
			{
				name: "三只松鼠",
				created_at: new Date(),
				updated_at: new Date(),
				hacked: false,
			},
			{
				name: "百草味",
				created_at: new Date(),
				updated_at: new Date(),
				hacked: true,
			},
		])
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("shop", null, {})
	},
}
