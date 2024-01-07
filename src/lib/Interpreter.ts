import assert from "@/utils/assert";

import MemoryTape from "./MemoryTape";
import { Token, TokenType } from "./Parser";

export default class Interpreter {
  public programCounter: number;
  public memory: MemoryTape;
  public stack: number[];

  constructor() {
    this.programCounter = 0;
    this.memory = new MemoryTape();
    this.stack = [];
  }

  execute(ast: Token[]) {
    let token = ast[this.programCounter];

    while (token.type != TokenType.END_OF_FILE) {
      switch (token.type) {
        case TokenType.POINTER_LEFT:
          this.memory.left(token.value);
          break;

        case TokenType.POINTER_RIGHT:
          this.memory.right(token.value);
          break;

        case TokenType.BEGIN_LOOP:
          this.stack.push(this.programCounter - 1);
          break;

        case TokenType.END_LOOP:
          const goto = this.stack.pop();

          assert(goto != undefined, "While loop not properly defined");

          if (this.memory.currentValue != 0) this.programCounter = goto;
          break;

        case TokenType.INCREMENT:
          this.memory.increment(token.value);
          break;

        case TokenType.DECREMENT:
          this.memory.decrement(token.value);
          break;

        case TokenType.PRINT:
          process.stdout.write(this.memory.currentChar);
          break;
      }

      this.programCounter++;

      token = ast[this.programCounter];
    }
  }
}
