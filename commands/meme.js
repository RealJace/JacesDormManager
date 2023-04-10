const Eris = require("eris");
const fetch = require("node-fetch");

exports.name = "meme";
exports.description = "giggles and funnies";
exports.options = [];
exports.execute = async (interaction) => {
	if (interaction instanceof Eris.CommandInteraction) {
		
		let raw_meme_data = await fetch("https://www.reddit.com/r/memes/random/.json");
		const meme_data = JSON.parse(raw_meme_data);
		
		console.log(meme_data);

		return interaction.createMessage("ive got a meme but im not showing your >:)");
	}
};