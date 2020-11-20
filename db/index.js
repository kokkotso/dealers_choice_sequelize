const Sequelize = require("sequelize");
const db = new Sequelize(
	process.env.DATABASE_URL || "postgres://localhost:5432/dealerschoicedb"
);

// Test database connection
const dbTest = async () => {
	try {
		await db.authenticate();
		console.log("Database connection successfully established.");
	} catch (err) {
		console.log("Unable to connect to database", error);
	}
};

module.exports = {
	db,
	dbTest,
};
