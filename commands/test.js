const Eris = require("eris");

exports.name = "test";
exports.description = "Testing command";
exports.options = [
	{
		type: Eris.Constants.ApplicationCommandOptionTypes.INTEGER,
		name: "say",
		description: "slay",
	}
];
exports.execute = (interaction) => {
	if (interaction instanceof Eris.CommandInteraction) {
		return interaction.createMessage("hello");
	}
};