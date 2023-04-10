import * as Eris from "eris";

export const name = "test";
export const description = "Testing command";
export const options = [
	{
		type: Eris.Constants.ApplicationCommandOptionTypes.INTEGER,
		name: "say",
		description: "slay",
	}
];
export async function execute(interaction) {
	if (interaction instanceof Eris.CommandInteraction) {
		return interaction.createMessage("hello");
	}
};