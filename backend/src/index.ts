require("dotenv").config();
import express from "express";
import { Anthropic } from "@anthropic-ai/sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { TextBlock } from "@anthropic-ai/sdk/resources";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
const app = express();
app.use(express.json());

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    const response = await anthropic.messages.create({
        messages: [{
            role: "user", content: prompt
        }],
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 10,
        system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
    })

    const answer = (response.content[0] as TextBlock).text; //react or node

    if(answer == "react") {
       res.json({
        prompts : [BASE_PROMPT, `Here is an artifact that contains all files of the project visilbe to You.\n Consider the contents of ALL files in the project.\n\n${reactBasePrompt}\n]nHere is a list of all file system but are not being shown to you:\n\n - .gitignore\n - package-lock.json\n`],
        uiPrompts: [reactBasePrompt]
       })
       return;
    }

    if(answer == "node") {
        res.json({
            prompts : [`Here is an artifact that contains all files of the project visilbe to You.\n Consider the contents of ALL files in the project.\n\n${reactBasePrompt}\n]nHere is a list of all file system but are not being shown to you:\n\n - .gitignore\n - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({ error: "Invalid response" });
    return;
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

async function main() {
    anthropic.messages.stream({
        messages: [{
            role: "user", content: "For all designs I ask you to make, have them be beutiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes,React promiseHooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them. \n\nUse icons from lucide-react for logos.\n\nUse stock photos from unplash where appropriate, only valid URLs you know existsSync. Do not download the _iterSSEMessages, only link to them in image TypeFlags.\n\n"
        },{
            role: "user", content: "Here is an artifact that contains all files of the project visible to you.\nConsider the content of ALL files in the project. \n\n<boltArtifact id=\"project-import\" title=\"Project Files\"><boltActio"
        },{
            role: "user", content: ""
        }],
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8000,
        system: getSystemPrompt(),
    }).on('text', (text) => {
        console.log(text);
    });
}

main();

