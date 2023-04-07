const Eris = require("eris");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);


exports.name = "openai";
exports.description = "Use OpenAI to get text, images and stuff";
exports.options = [
	{
		type: Eris.Constants.ApplicationCommandOptionTypes.STRING,
		name: "type",
		description: "What type of media do you want?",
        required: true,
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
		description: "What do you want to know?",
        required: true
	}
];

exports.execute = async (interaction) => {
	if (interaction instanceof Eris.CommandInteraction) {
		const request_type = interaction.data.options[0].value;
        const request_input = interaction.data.options[1].value;

        // Handle text input
        if (request_type == "text") {
            try {
                let conversationLog = [{
                    role: "system",
                    content: "You are a helpful and friendly chatbot."
                }];
    
                conversationLog.push({
                    role: "user",
                    content: request_input
                });
    
                const result = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: conversationLog
                });
    
                try {
                    if (result.data.choices[0].message.length < 2000) {
                        return interaction.createMessage(result.data.choices[0].message);
                    } else {
                        return interaction.createMessage({
                            file: {
                                name: "response.txt",
                                file: result.data.choices[0].message
                            }
                        });
                    }
                } catch {
                    return interaction.createMessage(`An error has occured : ${result.data.error.message}`);
                }
            } catch (error) {
                console.log(error.request.res.statusMessage);
                return interaction.createMessage(`An error has occured : ${error.request.res.statusMessage}`);
            }
        }
	}
};