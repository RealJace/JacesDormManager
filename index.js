import fs from "fs";
import path from "path";
import express from "express";
import fetch from "node-fetch";
import * as Eris from "eris";
import * as sqlite from "aa-sqlite";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

await sqlite.open("database.db")

await sqlite.run("DROP TABLE IF EXISTS users");
await sqlite.run("CREATE TABLE IF NOT EXISTS users(id STRING)");

var __dirname = path.resolve();

const webApp = express();
const port = 3000;
const client = new Eris.Client(`Bot ${process.env.BOT_TOKEN}`);
const commandModules = {};
const guildId = "1036643905480970251"; // What guild you want the commands to be in

export async function editUserDb(user) {
	if (user instanceof Eris.User) {
		const user_data = await sqlite.get("SELECT * FROM users WHERE id = ?",[user.id]);
		if (typeof(user_data) === undefined) {
			await sqlite.run("INSERT INTO users(id) VALUES (?)",[user.id]);
			console.log("Inserted data into a database");
		} else {
			await sqlite.run("UPDATE users SET id = ?",[user.id]);
			console.log("Updated data in a database");
		}
		return;
	}
	return console.warn("User argument is missing");
};

export async function getUserDb(user) {
	if (user instanceof Eris.User) {
		const user_data = await sqlite.get("SELECT * FROM users WHERE id = ?",[user.id]);
		return user_data;
	}
	return console.warn("User argument is missing");
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

	const listOfWordsResponse = await fetch("https://raw.githubusercontent.com/chucknorris-io/swear-words/master/en");
	const listOfWords = await listOfWordsResponse.text();
	const curseWords = listOfWords.split("\n");

	for (let word of curseWords) {
		if (message.content.includes(word) && word != "") {
			message.delete("A curse word was found");
			break;
		}
	};

	await editUserDb(message.author);
	const user_data = await getUserDb(message.author);
	console.log(user_data);

	const rows = await sqlite.get_all("SELECT * FROM users");

	console.log(rows);

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

process.on("exit",() => {
	sqlite.close();
});

client.connect();