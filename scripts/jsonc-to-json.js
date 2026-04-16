import { parse } from "jsr:@std/jsonc@^1.0.0";

const inFile = "js/background-config.jsonc";
const outFile = "js/gen/background-config.json";
const text = await Deno.readTextFile(inFile);
const data = parse(text);
await Deno.writeTextFile(outFile, JSON.stringify(data, null, 2) + "\n");
console.log(`${inFile} -> ${outFile}`);