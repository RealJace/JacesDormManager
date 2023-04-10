import fs from "fs";
import path from "path";
import express from "express";
import Eris from "eris";

const webApp = express();
const port = 3000;
const client = Eris(`Bot ${process.env.BOT_TOKEN}`);
const commandModules = {};
const guildId = "1036643905480970251"; // What guild you want the commands to be in

async function setupCommands() {
	const fullPath = path.join(__dirname,"commands")
	const files = fs.readdirSync(fullPath);
	try {
		console.log("Creating/Editing slash commands");
		const commands = [];
		for (let file of files) {
			const module = import(path.join(fullPath,file));
			commandModules[path.parse(file).name] = module;
			commands.push({
				name: module.name,
				type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
				description: module.description,
				options: module.options
			})
			console.log(`Created/Edited ${module.name}`);
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