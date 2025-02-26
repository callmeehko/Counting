import { Client, Message } from "@nerimity/nerimity.js/build/Client";
import { Tag } from "../classes/Tag";

module.exports = {
    name: "start",
    async execute(message: Message, client: Client, args: string[]) {
        let tagId = `channel:${message.channelId}:count`;
        let tag = new Tag().from(tagId);

        if(tag.value) {
            return message.reply("This channel is already a counting channel.")
        } else {
            tag.set("1");
            return message.reply("This channel is now a counting channel.")
        }
    }
}