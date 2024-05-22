class SquareRoot {
  constructor(number) {
    if (number !== undefined) {
      this.number = number;
      this.calculateSquareRoot();
    }
  }

  calculateSquareRoot() {
    const log2Value = Math.log2(this.number);
    const integerPart = Math.floor(log2Value / 2);
    const fractionalPart = log2Value / 2 - integerPart;

    this.integerPart = Math.pow(2, integerPart);
    this.hasFractionalPart = fractionalPart > 0;
  }

  getResult() {
    return {
      integerPart: this.integerPart,
      hasFractionalPart: this.hasFractionalPart,
    };
  }

  getFormattedResult() {
    let resultString = '';
    if (this.integerPart !== 1) {
      resultString += `${this.integerPart}`;
    }
    if (this.hasFractionalPart) {
      resultString += '√2';
    }
    return resultString || '1';
  }

  updateFromString(inputString) {
    const sqrtPart = inputString.includes('√2');
    const integerPartString = inputString.replace('√2', '');
    const integerPart = integerPartString ? parseInt(integerPartString, 10) : 1;

    this.integerPart = integerPart;
    this.hasFractionalPart = sqrtPart;
  }

  multiply(other) {
    if (!(other instanceof SquareRoot)) {
      throw new Error('Parameter must be an instance of SquareRoot');
    }

    // Integer part çarpılması
    let resultIntegerPart = this.integerPart * other.integerPart;

    // Fractional part kontrolü
    if (this.hasFractionalPart && other.hasFractionalPart) {
      resultIntegerPart *= 2;
      this.hasFractionalPart = false;
    } else if (this.hasFractionalPart || other.hasFractionalPart) {
      this.hasFractionalPart = true;
    } else {
      this.hasFractionalPart = false;
    }
 
    this.integerPart = resultIntegerPart;
  }
}

const generateRandomSquareRoot = () => {
  const possibleNumbers = [1, 2, 4, 8, 32, 128];
  
  number = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
  const temp = new SquareRoot(number);
  temp.calculateSquareRoot()
  return temp.getFormattedResult()
};


module.exports = { SquareRoot, generateRandomSquareRoot };