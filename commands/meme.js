import * as Eris from "eris";
import fetch from "node-fetch";

export const name = "meme";
export const description = "giggles and funnies";
export const options = [];
export async function execute(interaction) {
	if (interaction instanceof Eris.CommandInteraction) {
		
		const raw_meme_data = await fetch("https://www.reddit.com/r/memes/random/.json");
		const meme_response_data = await raw_meme_data.json();
		const meme_data = meme_response_data[0].data.children[0].data;

		const raw_author_data = await fetch(`https://www.reddit.com/user/${meme_data.author}/about.json`);
		const author_data = await raw_author_data.json();
		
		console.log(meme_data);

		return interaction.createMessage({
			embeds: [
				{
					title: meme_data.title,
					url: `https://www.reddit.com${meme_data.permalink}`,
					image: {url: meme_data.url},
					author: {
						name: meme_data.author,
						url: author_data.icon_img
					}
				}
			]
		});
	}
}