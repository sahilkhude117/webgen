require("dotenv").config();

import { Anthropic } from "@anthropic-ai/sdk";
import { log } from "console";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 0,
        messages: [{
            role: "user",
            content: "What is 2 + 2?"
        }]
    })
    console.log(msg);
}

main();

