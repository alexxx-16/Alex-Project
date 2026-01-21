import { readFile, writeFile, appendFile } from "node:fs/promises";
import { resolve } from "node:path";

const __dirname = import.meta.dirname;
const filePath = resolve(__dirname, "message.txt");
const myFilePath = resolve(__dirname, "myMessage.txt");

try {
  await appendFile(filePath, "Hello from Alex!\n");
  console.log("Append successful.");

  await writeFile(myFilePath, "Hello from Alex.", "utf8");
  console.log("Filed created successfully.");

  console.log(
    `Current content:\n ${await readFile(filePath, "utf8")}New content:\n${await readFile(myFilePath, "utf8")}`,
  );
} catch (error) {
  console.error("File system error: ", error.message);
}
