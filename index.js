import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const express = require("express");
const webApp = express();
const port = 3000;
const Eris = require("eris");
const client = Eris(`Bot ${process.env.BOT_TOKEN}`);
const commandModules = {};
const guildId = "1036643905480970251"; // What guild you want the commands to be in

async function setupCommands() {
	console.log("Creating/Editing slash commands");
	const fullPath = path.join(__dirname,"commands")
	const files = fs.readdirSync(fullPath);
	try {
		const commands = [];
		for (let file of files) {
			const module = require(path.join(fullPath,file));
			commandModules[path.parse(file).name] = module;
			commands.push({
				name: module.name,
				type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
				description: module.description,
				options: module.options
			})
		};
		await client.bulkEditGuildCommands(guildId,commands)
	} catch (error) {
		console.log(error);
	}
};

client.on("ready",() => {
	console.log("I'm ready to serve!");
	setupCommands();
});

client.on("interactionCreate", interaction => {
	if (interaction instanceof Eris.CommandInteraction) {
		const commandModule = commandModules[interaction.data.name];
		if (commandModule != null) {
			return commandModule.execute(interaction);
		}
	}
});

webApp.get("/",(request,response) => {
	response.send("Webserver up and running!")
});

webApp.listen(port,() => {
	console.log(`Listening on port ${port}`);
});

setInterval(async () => {
	await fetch("https://JacesDormManager.realjace.repl.co").then(console.log("Pinged."))
},240000);

client.connect();