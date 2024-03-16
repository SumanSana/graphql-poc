import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
import fs from 'fs';

export const saveDataIntoJsonFile = (db) => {
    const jsonString = JSON.stringify(db);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    console.log(path.join(__dirname, '../db/data.json'));
    fs.writeFileSync(path.join(__dirname, '../db/data.json'), jsonString);
}

