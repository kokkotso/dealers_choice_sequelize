const express = require("express");
const { db, dbTest, dbSync, dbSeed, Pokemon, Trainer, Type } = require("./db");
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
            <link rel="stylesheet" href="/styles.css" />
        </head>
        <body>
`;

const htmlNav = `
        <header>
            <div class="nav-logo">Pokedex</div>
            <nav>
            </nav>
        </header>
        <main>
`;

const htmlFooter = `
            </main>
        </body>
    </html>
`;

app.use(express.static("public"));

app.get("/", async (req, res) => {
	const query = await Pokemon.findAll({ include: Type });
	const html = `
        ${htmlHead}
        ${htmlNav}
        <h2>Pokemon</h2>
        <section class="card-grid">
                ${query
									.map((pokemon) => {
										return `
                        <div class="card ${pokemon.type.name.toLowerCase()}">
                            <img src="${pokemon.img}" />
                            <p class="title">${pokemon.name}</p>
                            <p class="cta"><a href="/pokemon/${
															pokemon.id
														}">See Pokedex Entry</a></p>
                        </div>
                    `;
									})
									.join("")}
        </section>
        ${htmlFooter}
    `;
	res.send(html);
});

app.get("/pokemon/:id", async (req, res) => {
	const id = req.params.id;
	const baseQuery = await Pokemon.findAll({
		where: {
			id: id,
		},
		include: Type,
	});

	const currPokemon = baseQuery[0];

	const fromQuery = await Pokemon.findAll({
		where: {
			id: currPokemon.evolves_from,
		},
	});

	const htmlPreviousForm =
		fromQuery.length !== 0
			? `<p><a href="/pokemon/${fromQuery[0].id}">&#8592; ${fromQuery[0].name}</a></p>`
			: `<p></p>`;

	const toQuery = await Pokemon.findAll({
		where: {
			evolves_from: currPokemon.id,
		},
	});

	const htmlEvolvedForm =
		toQuery.length !== 0
			? `<p><a href="/pokemon/${toQuery[0].id}">${toQuery[0].name} &#8594;</a></p>`
			: `<p></p>`;

	const html = `
        ${htmlHead}
        ${htmlNav}
        <section class="callout-main">
            <img src="${currPokemon.img}" />
            <div class="callout-caption">
                <div class="callout-text">
                    <h1>${currPokemon.name}</h1>
                    <h2><a href="/types/${currPokemon.type.name.toLowerCase()}">${
		currPokemon.type.name
	} Type Pokemon</a></h2>
                    <p>${currPokemon.description}</p>
                </div>
                <div class="callout-footer">
                    <div class="evolved-from">
                        <p>Evolved From:</p>
                        ${htmlPreviousForm}
                     </div>
                <div class="evolves-to">
                    <p>Evolves Into:</p>
                    ${htmlEvolvedForm}
                </div>
             </div>
        </div>
        </section>
        ${htmlFooter}
    `;

	res.send(html);
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
