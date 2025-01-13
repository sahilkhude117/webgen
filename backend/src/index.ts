require("dotenv").config();

import { Anthropic } from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
    anthropic.messages.stream({
        messages: [{
            role: "user",
            content: "Create a simple web app that displays a list of users and their details."
        }],
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: getSystemPrompt(),
    }).on('text', (text) => {
        console.log(text);
    });
}

main();

