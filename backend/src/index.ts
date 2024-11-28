require("dotenv").config();

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

async function main() {
    anthropic.messages.stream({
        messages: [],
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
    }).on('text',(text) => {
        console.log(text);
    })
}

main();

