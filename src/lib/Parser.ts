import assert from "@/utils/assert";

export enum TokenType {
  POINTER_LEFT,
  POINTER_RIGHT,
  INCREMENT,
  DECREMENT,
  BEGIN_LOOP,
  END_LOOP,
  INPUT,
  PRINT,
  END_OF_FILE,
  SUB_POINTER_LEFT,
  SUB_POINTER_RIGHT,
  BEGIN_SUB,
  END_SUB,
  CALL_SUB,
}

const Keywords = {
  POINTER_LEFT: "<",
  POINTER_RIGHT: ">",
  INCREMENT: "+",
  DECREMENT: "-",
  BEGIN_LOOP: "[",
  END_LOOP: "]",
  INPUT: ",",
  PRINT: ".",
  SUB_POINTER_LEFT: "{",
  SUB_POINTER_RIGHT: "}",
  BEGIN_SUB: "(",
  END_SUB: ")",
  CALL_SUB: "!",
};

export class Token {
  public readonly type: TokenType;

  public value: number;

  constructor(type: TokenType) {
    this.type = type;
    this.value = 1;
  }
}

export default class Parser {
  public readonly ast: Token[];
  public readonly stack: Token[];

  private lineNumber: number;

  constructor() {
    this.ast = [];
    this.stack = [];

    this.lineNumber = 0;
  }

  private get lastToken() {
    return this.ast[this.ast.length - 1];
  }

  private addToken(type: TokenType) {
    const token = new Token(type);

    this.ast.push(token);

    this.lineNumber++;

    return token;
  }

  private handleDuplicates(type: TokenType) {
    const { lastToken } = this;

    if (lastToken != undefined && lastToken.type == type) {
      lastToken.value++;
    } else {
      this.addToken(type);
    }
  }

  private handleBeginSub(type: TokenType) {
    const token = this.addToken(type);

    this.stack.push(token);
  }

  private handleEndSub(type: TokenType) {
    this.addToken(type);

    const beginToken = this.stack.pop();

    assert(beginToken != undefined, "Function not properly defined.");

    beginToken.value = this.lineNumber - 1;
  }

  parse(content: string) {
    for (const char of content) {
      switch (char) {
        case Keywords.POINTER_LEFT:
          this.handleDuplicates(TokenType.POINTER_LEFT);
          break;

        case Keywords.POINTER_RIGHT:
          this.handleDuplicates(TokenType.POINTER_RIGHT);
          break;

        case Keywords.BEGIN_LOOP:
          this.addToken(TokenType.BEGIN_LOOP);
          break;

        case Keywords.END_LOOP:
          this.addToken(TokenType.END_LOOP);
          break;

        case Keywords.INCREMENT:
          this.handleDuplicates(TokenType.INCREMENT);
          break;

        case Keywords.DECREMENT:
          this.handleDuplicates(TokenType.DECREMENT);
          break;

        case Keywords.INPUT:
          this.addToken(TokenType.INPUT);
          break;

        case Keywords.PRINT:
          this.addToken(TokenType.PRINT);
          break;

        case Keywords.SUB_POINTER_LEFT:
          this.handleDuplicates(TokenType.SUB_POINTER_LEFT);
          break;

        case Keywords.SUB_POINTER_RIGHT:
          this.handleDuplicates(TokenType.SUB_POINTER_RIGHT);
          break;

        case Keywords.BEGIN_SUB:
          this.handleBeginSub(TokenType.BEGIN_SUB);
          break;

        case Keywords.END_SUB:
          this.handleEndSub(TokenType.END_SUB);
          break;

        case Keywords.CALL_SUB:
          this.addToken(TokenType.CALL_SUB);
          break;
      }
    }

    this.addToken(TokenType.END_OF_FILE);

    return this.ast.slice();
  }
}
