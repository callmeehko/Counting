import { Client } from "@nerimity/nerimity.js";
import { ChannelType } from "@nerimity/nerimity.js/build/RawData";
import { Tag } from "./classes/Tag";
import { generateCommands } from "./utils/register";

let client = new Client();
let prefix = process.env.PREFIX || "c!";

const commands = generateCommands();

client.on('ready', () => {
    client.user?.setActivity({
        action: "Counting",
        name: "numbers",
        startedAt: new Date().getTime()
    })
})

// Message Counting Channel
client.on('messageCreate', async (message) => {
    if(!message.user.bot && !message.content?.startsWith(prefix) && message.channel.type == ChannelType.SERVER_TEXT) {
        let tagId = `channel:${message.channelId}:count`;
        let tag = new Tag().from(tagId);

        if(tag.value) {
            if(Number(message.content) == tag.value) {
                tag.set(`${Number(tag.value) + 1}`);
            } else {
                message.delete();
            }
        }
    }
})

// Commands
client.on('messageCreate', async (message) => {
    if(!message.user.bot && message.content?.startsWith(prefix) && message.channel.type == ChannelType.SERVER_TEXT) {
        let cmdName = message.content.replace(prefix, '').split(' ')[0];
        let args = message.content.replace(prefix, '').split(' ').slice(1);
        commands.forEach((command) => {
            if(command.name == cmdName) {
                command.execute(message, client, args);
            }
        })
    }
})


export default client;