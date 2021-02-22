'use strict';
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('toDos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: false,
      type: Sequelize.INTEGER
    },
    toDoId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    Title: {
      type: Sequelize.STRING
    },
    Description: {
      type: Sequelize.STRING
    },
    priority: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('toDos');
}