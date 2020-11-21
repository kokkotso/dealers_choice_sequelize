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
	img: {
		type: DataTypes.STRING,
		defaultValue: "https://via.placeholder.com/720",
	},
});

// Define associations
Trainer.belongsToMany(Pokemon, {
	through: "captures",
});
Pokemon.belongsToMany(Trainer, {
	through: "captures",
});

Pokemon.belongsTo(Pokemon, {
	foreignKey: "evolves_from",
	defaultValue: null,
});
Pokemon.belongsTo(Type);

Type.hasMany(Pokemon);
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

	electric.weakness = ground.id;
	water.weakness = electric.id;
	fire.weakness = water.id;
	grass.weakness = fire.id;
	ground.weakness = grass.id;

	[electric, water, fire, grass, ground].forEach(async (type) => {
		await type.save();
	});

	// Pokemons
	const pikachu = await Pokemon.create({
		name: "Pikachu",
		description:
			"It keeps its tail raised to monitor its surroundings. If you yank its tail, it will try to bite you.",
		typeId: electric.id,
		img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
	});

	const [charmander, charmeleon, charizard] = await Promise.all([
		Pokemon.create({
			name: "Charmander",
			description:
				"The flame at the tip of its tail makes a sound as it burns. You can only hear it in quiet places.",
			typeId: fire.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
		}),
		Pokemon.create({
			name: "Charmeleon",
			description:
				"Tough fights could excite this POKéMON. When excited, it may blow out bluish-white flames.",
			typeId: fire.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png",
		}),
		Pokemon.create({
			name: "Charizard",
			description:
				"When expelling a blast of super hot fire, the red flame at the tip of its tail burns more intensely.",
			typeId: fire.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
		}),
	]);

	charmeleon.evolves_from = charmander.id;
	charizard.evolves_from = charmeleon.id;

	const [squirtle, wartortle, blastoise] = await Promise.all([
		Pokemon.create({
			name: "Squirtle",
			description:
				"Shoots water at prey while in the water. Withdraws into its shell when in danger.",
			typeId: water.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
		}),
		Pokemon.create({
			name: "Wartortle",
			description:
				"When tapped, this Pokemon will pull in its head, but its tail will still stick out a little bit.",
			typeId: water.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/008.png",
		}),
		Pokemon.create({
			name: "Blastoise",
			description:
				"Once it takes aim at its enemy, it blasts out water with even more force than a fire hose.",
			typeId: water.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
		}),
	]);

	wartortle.evolves_from = squirtle.id;
	blastoise.evolves_from = wartortle.id;

	const [bulbasaur, ivysaur, venusaur] = await Promise.all([
		Pokemon.create({
			name: "Bulbasaur",
			description:
				"It can go for days without eating a single morsel. In the bulb on its back, it stores energy.",
			typeId: grass.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
		}),
		Pokemon.create({
			name: "Ivysaur",
			description:
				"The bulb on its back grows by drawing energy. It gives off an aroma when it is ready to bloom.",
			typeId: grass.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png",
		}),
		Pokemon.create({
			name: "Venusaur",
			description:
				"The flower on its back catches the sun’s rays. The sunlight is then absorbed and used for energy.",
			typeId: grass.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png",
		}),
	]);

	ivysaur.evolves_from = bulbasaur.id;
	venusaur.evolves_from = ivysaur.id;

	const [diglett, dugtrio] = await Promise.all([
		Pokemon.create({
			name: "Diglett",
			description:
				"It prefers dark places. It spends most of its time underground, though it may pop up in caves.",
			typeId: ground.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/050.png",
		}),
		Pokemon.create({
			name: "Dugtrio",
			description:
				"A team of triplets that can burrow over 60 MPH. Due to this, some people think it’s an earthquake.",
			typeId: ground.id,
			img: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/051.png",
		}),
	]);

	[
		pikachu,
		charmeleon,
		charmeleon,
		charizard,
		squirtle,
		wartortle,
		blastoise,
		bulbasaur,
		ivysaur,
		venusaur,
		diglett,
		dugtrio,
	].forEach(async (pokemon) => {
		await pokemon.save();
	});

	// Trainers
	const [yellow, red, gary] = await Promise.all([
		Trainer.create({ name: "Yellow" }),
		Trainer.create({ name: "Red" }),
		Trainer.create({ name: "Gary" }),
	]);

	await Promise.all([
		yellow.addPokemon(pikachu, { through: { selfGranted: false } }),
		yellow.addPokemon(bulbasaur, { through: { selfGranted: false } }),
		red.addPokemon(diglett, { through: { selfGranted: false } }),
		red.addPokemon(charmeleon, { through: { selfGranted: false } }),
		gary.addPokemon(squirtle, { through: { selfGranted: false } }),
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
	Pokemon,
	Trainer,
	Type,
};
