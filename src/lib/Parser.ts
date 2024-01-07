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

  constructor() {
    this.ast = [];
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
    }
  }

  private handleCommon(type: TokenType) {
    const token = new Token(type);

    this.ast.push(token);
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
      }
    }

    this.ast.push(new Token(TokenType.END_OF_FILE));

    return this.ast.slice();
  }
}
