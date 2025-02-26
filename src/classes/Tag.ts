import fs from 'fs';
import path from 'path';

interface Cache {
    tag: Tag,
    date: Date
}

const dataPath = path.join(process.cwd(), 'data')
export let cache: Cache[] = [];

// CACHE TO SAVE SYSTEM RESOURCES
// Cooldown of 7 seconds


export class Tag {
    public id: string;
    public value: any;

    constructor(id: string = "", value: any = null) {
        this.id = id;
        this.value = value;
    }

    public from(id: string): Tag {
        const cachedItem = cache.find(t => t.tag.id === id);
        if (cachedItem) {
            return cachedItem.tag;
        }
        try {
            const tagFile = fs.readFileSync(path.join(dataPath, id), 'utf-8');
            return new Tag(id, tagFile);
        } catch {
            return new Tag(id, null);
        }
    }

    public set(value: any) {
        this.value = value;
        const cachedItem = cache.find(t => t.tag.id === this.id);
        if(cachedItem) {
            let index = cache.findIndex(t => t.tag.id === this.id)
            cache.splice(index, 1);
            const difference = (new Date().getTime() - cachedItem.date.getTime()) / 1000;

            if(difference > 7) {
                cache.push({
                    tag: this,
                    date: new Date(),
                });
                // Can update the file now
                fs.writeFileSync(path.join(dataPath, this.id), value);
            } else {
                cache.push({
                    tag: this,
                    date: cachedItem.date,
                })
            }
        } else {
            // No cache entry exists, save to file
            cache.push({
                tag: this,
                date: new Date(),
            })
            fs.writeFileSync(path.join(dataPath, this.id), value);
        }
        
        return this;
    }

    public save() {
        const cachedItem = cache.find(t => t.tag.id === this.id);
        if(cachedItem) {
            const difference = (new Date().getTime() - cachedItem.date.getTime()) / 1000;
            if(difference > 7) {
                // Can run the save now.

                fs.writeFileSync(path.join(dataPath, this.id), this.value);
                let index = cache.findIndex(t => t.tag.id === this.id)
                cache.splice(index, 1);

                cache.push({
                    tag: this,
                    date: new Date(),
                })
            }
        } else {
            // prob has no cache so :)
            fs.writeFileSync(path.join(dataPath, this.id), this.value);

            cache.push({
                tag: this,
                date: new Date(),
            })
        }
    }

    public forceSave() {
        // FORCE SAVE RIGHT WHEN THIS IS SET.
        // ONLY USE THIS FOR LIKE WHEN IT CRASHES OR SOMETHING IDK
        fs.writeFileSync(path.join(dataPath, this.id), this.value);
    }
}