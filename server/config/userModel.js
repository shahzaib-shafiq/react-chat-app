const { sequelize } = require("../Config/db");

const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allownull: false,
  },
  Socket_id: {
    type: DataTypes.STRING,
    allownull: false,
  },
});

User.sync({ alter: true }) // you can use force true instead of alter to drop the table and create new
  .then((result) => {
    if (result.changed) {
      console.log("Alumni table updated successfully.");
    } else {
      console.log("Alumni table already exists and is up to date.");
    }
  })
  .catch((err) => {
    console.error("Error synchronizing Alumni table:", err);
  });
module.exports = User;
