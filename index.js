import fs from "fs";
import path from "path";
import express from "express";
import fetch from "node-fetch";
import * as Eris from "eris";
import sqlite3 from "sqlite3";
sqlite3.verbose();
import * as sqlite from "sqlite";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const database = await sqlite.open({
	filename: "database.db",
	driver: sqlite3.Database
});

await database.exec("DROP TABLE IF EXISTS users");
await database.exec("CREATE TABLE IF NOT EXISTS users(id STRING)");

process.on("exit",() => {
	database.close();
});

var __dirname = path.resolve();

const webApp = express();
const port = 3000;
const client = new Eris.Client(`Bot ${process.env.BOT_TOKEN}`);
const commandModules = {};
const guildId = "1036643905480970251"; // What guild you want the commands to be in

async function addUserIntoDb(user) {
	if (user instanceof Eris.User) {
		const user_data = await database.get("SELECT * FROM users WHERE id = ?",[user.id]);
		console.log(user_data);
		/*
		database.all("SELECT * FROM users",[],(err,rows) => {
			if (err) return console.error(err);
			for (let row of rows) {
				if (row["id"] != user.author.id) {
					database.run("INSERT INTO users(id) VALUES (?)",[user.id],(err) => {
						if (err) return console.error(err);
					});
					break;
				}
			}
		});
		*/
	}
};

async function setupCommands() {
	const fullPath = path.join(__dirname,"commands")
	const files = fs.readdirSync(fullPath);
	try {
		console.log("Creating/Editing slash commands");
		const commands = [];
		for (let file of files) {
			const commandModule = await import(path.join(fullPath,file));
			commandModules[path.parse(file).name] = commandModule;
			commands.push({
				name: commandModule.name,
				description: commandModule.description,
				options: commandModule.options,
				type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT
			})
			console.log(`Created/Edited ${commandModule.name}`);
		};
		await client.bulkEditGuildCommands(guildId,commands)
		console.log("Finished creating/editing slash commands")
	} catch (error) {
		console.log("Failed to create/edit slash commands");
		console.log(error);
	}
};

client.on("ready",() => {
	console.log("I'm ready to serve!");
	setupCommands();
});

client.on("messageCreate",async message => {

	if (message.author.bot) return;

	addUserIntoDb(message.author);

	const listOfWordsResponse = await fetch("https://raw.githubusercontent.com/chucknorris-io/swear-words/master/en");
	const listOfWords = await listOfWordsResponse.text();
	const curseWords = listOfWords.split("\n");

	for (let word of curseWords) {
		if (message.content.includes(word) && word != "") {
			message.delete("A curse word was found");
			break;
		}
	};

})

client.on("interactionCreate", interaction => {
	if (interaction instanceof Eris.CommandInteraction) {
		const commandModule = commandModules[interaction.data.name];
		if (commandModule != null) {
			return commandModule.execute(interaction);
		}
	}
});

webApp.get("/",(request,response) => {
	response.send("Webserver up and running!");
	console.log("Webserver pinged");
});

webApp.listen(port,() => {
	console.log(`Listening on port ${port}`);
});

client.connect();