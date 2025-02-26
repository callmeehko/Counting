import consola from "consola";
import client from "./client";
import dotenv from 'dotenv';
import { cache } from "./classes/Tag";
import readline from 'readline';
import { promptCommand } from "./utils/consoleCommand";
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

async function main() {
    consola.box("Counting")
    consola.info("Loading bot...")

    client.login(process.env.BOT_TOKEN || "");

    consola.success("Started Counting")

    promptCommand(rl);
}

process.on('SIGINT', () => {
    consola.info('Detecting close, saving cache.')
    if(cache) {
        cache.forEach(c => {
            c.tag.forceSave();
            consola.success(`Saved ${c.tag.id}`)
        })
    }

    consola.info("Bye!")
    process.exit();
})

main();