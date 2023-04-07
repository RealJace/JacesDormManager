const Eris = require("eris");

exports.name = "openai";
exports.description = "Use OpenAI to get text, images and stuff";
exports.options = [
	{
		type: Eris.Constants.ApplicationCommandOptionTypes.STRING,
		name: "type",
		description: "What type of media do you want?",
        choices: [
            {
                name: "Text",
                value: "text"
            },
            {
                name: "Image",
                value: "image"
            }
        ]
	},
    {
		type: Eris.Constants.ApplicationCommandOptionTypes.STRING,
		name: "input",
		description: "What do you want to know?"
	}
];
exports.execute = (interaction) => {
	if (interaction instanceof Eris.CommandInteraction) {
		return interaction.createMessage("hello");
	}
};