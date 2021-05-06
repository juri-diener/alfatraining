export const tax = 19;
export const shipping = 4.99;

export const convertNumberInReadableStream = (number: number): string => {
  let numString = parseFloat(String(number)).toFixed(2);
  let count = 1;
  const numbersArr = [];
  let lastDigits = "";
  if (numString.indexOf(".") !== -1) {
    lastDigits = "," + numString.substring(numString.indexOf(".") + 1);
    numString = numString.substring(0, numString.indexOf("."));
  }
  for (let i = numString.length - 1; i >= 0; i--) {
    numbersArr.unshift(numString[i]);
    if (count % 3 === 0 && numString.length !== count) {
      numbersArr.unshift(".")
    }
    count++;
  }
  const convertNumber = numbersArr.join("") + lastDigits;
  return convertNumber;
}