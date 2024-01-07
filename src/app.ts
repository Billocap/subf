import * as path from "path";
import * as fs from "fs";

import assert from "@/utils/assert";
import Parser from "@/lib/Parser";
import Interpreter from "@/lib/Interpreter";

const args = process.argv.slice(2);

assert(args.length != 0, "No input file");

const [inputFile] = args;

const targetFile = path.resolve(inputFile);

const content = fs.readFileSync(targetFile).toString();

const parser = new Parser();

parser.parse(content);

const interpreter = new Interpreter();

interpreter.execute(parser.ast);
