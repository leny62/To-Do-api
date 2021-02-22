import bcrypt from 'bcrypt';
'use strict';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    userId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'users',
  });

  users.beforeSave((user, options) => {
    if (user.changed('password')) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    }
  });

  users.prototype.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };
  
  users.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.todos, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return users;
};