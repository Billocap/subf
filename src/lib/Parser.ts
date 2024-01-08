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

  private handleDuplicates(type: TokenType) {
    const { lastToken } = this;

    if (lastToken != undefined && lastToken.type == type) {
      lastToken.value++;
    } else {
      const token = new Token(type);

      this.ast.push(token);

      this.lineNumber++;
    }
  }

  private handleCommon(type: TokenType) {
    const token = new Token(type);

    this.ast.push(token);

    this.lineNumber++;
  }

  private handleBeginSub(type: TokenType) {
    const token = new Token(type);

    this.stack.push(token);

    this.ast.push(token);

    this.lineNumber++;
  }

  private handleEndSub(type: TokenType) {
    const token = new Token(type);

    const beginToken = this.stack.pop();

    assert(beginToken != undefined, "Function not properly defined.");

    beginToken.value = this.lineNumber;

    this.ast.push(token);

    this.lineNumber++;
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
          this.handleCommon(TokenType.BEGIN_LOOP);
          break;

        case Keywords.END_LOOP:
          this.handleCommon(TokenType.END_LOOP);
          break;

        case Keywords.INCREMENT:
          this.handleDuplicates(TokenType.INCREMENT);
          break;

        case Keywords.DECREMENT:
          this.handleDuplicates(TokenType.DECREMENT);
          break;

        case Keywords.INPUT:
          this.handleCommon(TokenType.INPUT);
          break;

        case Keywords.PRINT:
          this.handleCommon(TokenType.PRINT);
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
          this.handleCommon(TokenType.CALL_SUB);
          break;
      }
    }

    this.handleCommon(TokenType.END_OF_FILE);

    return this.ast.slice();
  }
}
