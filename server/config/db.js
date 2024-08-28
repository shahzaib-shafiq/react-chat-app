const Sequelize = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
  }
);

let connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connecting to DB");
    // Sync the tables here if necessary

    return sequelize; // Return the sequelize instance for further use
  } catch (error) {
    console.error("Unable to connect to the database. Details:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  connectToDatabase,
};
