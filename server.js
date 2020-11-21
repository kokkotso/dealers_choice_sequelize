const express = require("express");
const { db, dbTest, dbSync, dbSeed } = require("./db");
const path = require("path");

const port = process.env.PORT || 3000;

const app = express();

// HTML templates
const htmlHead = `
    <!doctype html>
        <html lang="en">
        <head>
            <title>Pokedex</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
`;

const htmlNav = `
    <header>
        <div class="nav-logo">Pokedex</div>
        <nav>
        </nav>
    </header>
`;

const htmlFooter = `
        </body>
    </html>
`;

app.get("/", (req, res) => {});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const init = async () => {
	await dbTest();
	await dbSync();
	await dbSeed();
};

init();
