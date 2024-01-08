import * as path from "path";
import * as fs from "fs";

import assert from "@/utils/assert";
import Parser from "@/lib/Parser";
import Interpreter from "@/lib/Interpreter";

function main() {
  const args = process.argv.slice(2);

  assert(args.length != 0, "No input file");

  const [inputFile] = args;

  const targetFile = path.resolve(inputFile);

  const content = fs.readFileSync(targetFile).toString();

  const parser = new Parser();

  const ast = parser.parse(content);

  const interpreter = new Interpreter({
    input() {
      const buffer = Buffer.alloc(1);

      fs.readSync(0, buffer, 0, 1, 0);

      return buffer.toString().charCodeAt(0);
    },
    output(char) {
      process.stdout.write(char);
    },
  });

  interpreter.execute(ast);
}

try {
  main();
} catch (error: any) {
  console.log(error.message);
}
