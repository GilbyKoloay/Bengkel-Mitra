export default function splitString(string, splitIndex, splitUsing) {
  let newString = '';
  
  string?.toString().split('').reverse().forEach((character, index) => {
    newString += character;
    if (
      index+1 !== string.toString().length &&
      (index+1) % splitIndex === 0
    ) newString += splitUsing;
  });

  return newString.toString().split('').reverse().join('');
};
