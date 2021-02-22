'use strict';

export default (sequelize, DataTypes) => {
const toDos = sequelize.define('toDos', {
    toDoId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    Title: DataTypes.STRING,
    Description: DataTypes.STRING,
    priority: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'toDos',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });

  toDos.associate = function (models) {
    toDos.belongsTo(models.users, {
      foreignKey: 'userId'
    })
  }
  return toDos;
};