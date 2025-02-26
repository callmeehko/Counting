import consola from 'consola';
import { Interface } from 'readline';
import { cache } from '../classes/Tag';

export function promptCommand(rl: Interface) {
    rl.question('> ', (cmd) => {
        switch (cmd.trim().toLocaleLowerCase()) {
            case 'cache':
                consola.log(cache);
                break;
            default:
                consola.warn('Unknown command.');
        }

        promptCommand(rl);
    });
}
