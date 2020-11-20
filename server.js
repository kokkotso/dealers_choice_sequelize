const express = require("express");
const { db, dbTest, dbSync, dbSeed } = require("./db");

const port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
	res.send(`<h1>This works</h1>`);
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const init = async () => {
	await dbTest();
	await dbSync();
	await dbSeed();
};

init();
