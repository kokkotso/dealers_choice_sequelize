const { Sequelize, DataTypes } = require("sequelize");

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

// Define models
const Pokemon = db.define("pokemon", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	img: {
		type: DataTypes.STRING,
		defaultValue: "https://via.placeholder.com/720",
	},
});

const Type = db.define("type", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
});

const Trainer = db.define("trainer", {
	uuid: {
		type: DataTypes.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	},
});

// Define associations
Trainer.belongsToMany(Pokemon, { through: "trainer_pokemon" });
Pokemon.belongsToMany(Trainer, { through: "trainer_pokemon" });

Pokemon.hasOne(Pokemon, {
	foreignKey: "evolves_to",
});
Pokemon.belongsTo(Pokemon, {
	foreignKey: "evolves_from",
});
Pokemon.belongsTo(Type);

Type.hasMany(Pokemon);
Type.hasOne(Type, {
	foreignKey: "strength",
});
Type.hasOne(Type, {
	foreignKey: "weakness",
});

// Create instances
const dbSeed = async () => {
	// Types
	const [electric, water, fire, grass, ground] = await Promise.all([
		Type.create({ name: "Electric" }),
		Type.create({ name: "Water" }),
		Type.create({ name: "Fire" }),
		Type.create({ name: "Grass" }),
		Type.create({ name: "Ground" }),
	]);

	// Pokemon
	const pikachu = await Pokemon.create({
		name: "Pikachu",
		description:
			"It keeps its tail raised to monitor its surroundings. If you yank its tail, it will try to bite you.",
		typeId: electric.id,
	});

	const [charmander, charmeleon, charizard] = await Promise.all([
		Pokemon.create({
			name: "Charmander",
			description:
				"The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places.",
			typeId: fire.id,
		}),
		Pokemon.create({
			name: "Charmeleon",
			description:
				"Tough fights could excite this POKéMON. When excited, it may blow out bluish-white flames.",
			typeId: fire.id,
		}),
		Pokemon.create({
			name: "Charizard",
			description:
				"When expelling a blast of super hot fire, the red flame at the tip of its tail burns more intensely.",
			typeId: fire.id,
		}),
	]);

	const [squirtle, wartortle, blastoise] = await Promise.all([
		Pokemon.create({
			name: "Squirtle",
			description:
				"Shoots water at prey while in the water. Withdraws into its shell when in danger.",
			typeId: water.id,
		}),
		Pokemon.create({
			name: "Wartortle",
			description:
				"When tapped, this Pokemon will pull in its head, but its tail will still stick out a little bit.",
			typeId: water.id,
		}),
		Pokemon.create({
			name: "Blastoise",
			description:
				"Once it takes aim at its enemy, it blasts out water with even more force than a fire hose.",
			typeId: water.id,
		}),
	]);

	const [bulbasaur, ivysaur, venusaur] = await Promise.all([
		Pokemon.create({
			name: "Bulbasaur",
			description:
				"It can go for days without eating a single morsel. In the bulb on its back, it stores energy.",
			typeId: grass.id,
		}),
		Pokemon.create({
			name: "Ivysaur",
			description:
				"The bulb on its back grows by drawing energy. It gives off an aroma when it is ready to bloom.",
			typeId: grass.id,
		}),
		Pokemon.create({
			name: "Venusaur",
			description:
				"The flower on its back catches the sun’s rays. The sunlight is then absorbed and used for energy.",
			typeId: grass.id,
		}),
	]);

	const [diglett, dugtrio] = await Promise.all([
		Pokemon.create({
			name: "Diglett",
			description:
				"It prefers dark places. It spends most of its time underground, though it may pop up in caves.",
			typeId: ground.id,
		}),
		Pokemon.create({
			name: "Dugtrio",
			description:
				"A team of triplets that can burrow over 60 MPH. Due to this, some people think it’s an earthquake.",
			typeId: ground.id,
		}),
	]);
};

// Sync database
const dbSync = async () => {
	try {
		await db.sync({ force: true });
		console.log("Database successfully synced");
	} catch {
		console.log("Error during database sync", error);
	}
};

module.exports = {
	db,
	dbTest,
	dbSeed,
	dbSync,
};
