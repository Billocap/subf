import assert from "@/utils/assert";

import MemoryTape from "./MemoryTape";
import { Token, TokenType } from "./Parser";

interface IO {
  input(): number;
  output(char: string): void;
}

export default class Interpreter {
  public programCounter: number;
  public memory: MemoryTape;
  public functions: MemoryTape;
  public stack: number[];

  private readonly io: IO;

  constructor(io: IO) {
    this.programCounter = 0;
    this.memory = new MemoryTape();
    this.functions = new MemoryTape();
    this.stack = [];

    this.io = io;
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

        case TokenType.SUB_POINTER_LEFT:
          this.functions.left(token.value);
          break;

        case TokenType.SUB_POINTER_RIGHT:
          this.functions.right(token.value);
          break;

        case TokenType.BEGIN_LOOP:
          this.stack.push(this.programCounter - 1);
          break;

        case TokenType.END_LOOP:
          const goto = this.stack.pop();

          assert(goto != undefined, "While loop not properly defined");

          if (this.memory.currentValue != 0) this.programCounter = goto;
          break;

        case TokenType.BEGIN_SUB:
          this.functions.store(this.programCounter);

          this.programCounter = token.value;

          break;

        case TokenType.END_SUB:
          const returnTo = this.stack.pop();

          assert(returnTo != undefined, "Function not properly defined");

          if (this.memory.currentValue != 0) this.programCounter = returnTo;

          break;

        case TokenType.CALL_SUB:
          this.stack.push(this.programCounter);

          this.programCounter = this.functions.currentValue;

          break;

        case TokenType.INCREMENT:
          this.memory.increment(token.value);
          break;

        case TokenType.DECREMENT:
          this.memory.decrement(token.value);
          break;

        case TokenType.PRINT:
          this.io.output(this.memory.currentChar);
          break;

        case TokenType.INPUT:
          this.memory.store(this.io.input());
          break;
      }

      this.programCounter++;

      token = ast[this.programCounter];
    }
  }
}
