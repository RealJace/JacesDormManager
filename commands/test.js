import eris from "eris";

export const name = "test";
export const description = "Testing command";
export const options = [
	{
		type: eris.Constants.ApplicationCommandOptionTypes.INTEGER,
		name: "say",
		description: "slay",
	}
];
export async function execute(interaction) {
	if (interaction instanceof eris.CommandInteraction) {
		return interaction.createMessage("hello");
	}
};