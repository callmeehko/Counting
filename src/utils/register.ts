import { Client, Message } from "@nerimity/nerimity.js/build/Client";
import fs from 'fs';
import path from 'path';

let cmdPath = path.join(process.cwd(), 'src', 'commands');

interface Command {
    name: string;
    execute(message: Message, client: Client, args: string[]): Promise<void>;
}

export function generateCommands(): Command[] {
    let commands: Command[] = [];

    fs.readdirSync(cmdPath).forEach((file) => {
        if(!file.endsWith('.ts')) return;
        let cmd = require(path.join(cmdPath, file));
        commands.push(cmd);
    })

    return commands;
}