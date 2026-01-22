import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { input } from "@inquirer/prompts";
import qr from "qr-image";

const __dirname = import.meta.dirname;
const txtPath = resolve(__dirname, "user-qr-code.txt");
const imgPath = resolve(__dirname, "user-qr-code.png");

try {
  const answer = await input({ message: "What's your favourite website?" });
  //   console.log(answer);
  const userQR = qr.image(answer, { type: "png" });

  await Promise.all([
    pipeline(userQR, createWriteStream(imgPath)),
    writeFile(txtPath, answer),
  ]);
} catch (error) {
  console.error(`An error occurred: ${error.message}`);
}
