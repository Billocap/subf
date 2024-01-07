export default class MemoryTape extends Array {
  public pointer: number;

  constructor(size: number = 30000) {
    super(size);

    this.fill(0);

    this.pointer = 0;
  }

  get currentValue() {
    return this[this.pointer];
  }

  get currentChar() {
    return String.fromCharCode(this.currentValue);
  }

  left(amount: number = 1) {
    this.pointer = (this.pointer + amount) % this.length;
  }

  right(amount: number = 1) {
    const newPosition = this.pointer - amount;

    this.pointer = newPosition >= 0 ? newPosition : this.length + newPosition;
  }

  increment(amount: number = 1) {
    this[this.pointer] = (this.currentValue + amount) % 255;
  }

  decrement(amount: number = 1) {
    const newValue = this.currentValue - amount;

    this[this.pointer] = newValue >= 0 ? newValue : 255 + newValue;
  }
}
