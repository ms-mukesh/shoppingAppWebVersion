const validateEmail = (value) => {
  let emailPattern = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(value.toLowerCase());
};
function is18orOlder(dateString) {
  const dob = new Date(dateString);
  const dobPlus18 = new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());

  return dobPlus18.valueOf() <= Date.now();
}
function age(birthdate) {
  return Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / 3.154e10);
}
const validateAdhaarNo = (value) => {
  let adhaarPattern = /^[0-9]{12}$/;
  return adhaarPattern.test(value);
};
const checkNamesIsEmpty = (value) => {
  if (value.length <= 0 || value == '-') {
    return true;
  }
  return false;
};
const autoCapitalString = (str) => {
  // return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return str;
};
const generateRandomNumber = () => {
  // Declare a digits variable
  // which stores all digits
  const digits = '0123456789';
  let NUMBER = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    NUMBER += digits[Math.floor(Math.random() * 10)];
  }
  return NUMBER;
};
const isAlpha = (value) => {
  let alphaPatter = /^[a-zA-Z]+$/;
  return alphaPatter.test(value);
};
const isAlphaWithSpace = (value) => {
  let alphaPatter = /^[a-zA-Z ]+$/;
  return alphaPatter.test(value);
};
const isNumeric = (value) => {
  let alphaPatter = /^[0-9]+$/;
  return alphaPatter.test(value);
};
const isEmptySting = (value) => {};
const removeDuplicates = (arrayName, key) => {
  var obj = {};
  for (let i = 0, len = arrayName.length; i < len; i++) obj[arrayName[i][key]] = arrayName[i];

  const tempNewArray = new Array();
  for (let key in obj) tempNewArray.push(obj[key]);
  return tempNewArray;
};
const sumTotalPrice = (arr) => arr.reduce((sum, { price, quantity }) => sum + price, 0);
const sumTotalQty = (arr) => arr.reduce((sum, { price, quantity }) => sum + quantity, 0);

const isNumericValue = (value) => {
  const re = /^\d*(\.\d+)?$/;
  return value.match(re);
};

export {
  sumTotalPrice,
  sumTotalQty,
  removeDuplicates,
  age,
  is18orOlder,
  isAlphaWithSpace,
  isNumeric,
  isAlpha,
  validateAdhaarNo,
  validateEmail,
  checkNamesIsEmpty,
  autoCapitalString,
  generateRandomNumber,
  isNumericValue
};
