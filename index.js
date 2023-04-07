const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const express = require("express");
const webApp = express();
const port = 3000;
const Eris = require("eris");
const bot = new Eris.Client(process.env.BOT_TOKEN);
const commandModules = {};
const guildId = "1036643905480970251"; // What guild you want the commands to be in

function setupCommands() {
	const fullPath = path.join(__dirname,"commands")
	const files = fs.readdirSync(fullPath);
	try {
		for (let file of files) {
			const module = require(path.join(fullPath,file));
			commandModules[path.parse(file).name] = module;
			await client.createGuildCommand(guildId, {
				name: module.name,
				type: Eris.Constants.App
			});
		};
	} catch (error) {
		console.log(error);
	}
};

bot.on("ready",() => {
	setupCommands();
	console.log("I'm ready to serve!");
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

bot.connect();