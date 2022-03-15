const updateSpecificity = (arrToCheck) => {
  let counter = {};

  for (let value of arrToCheck) {
    if (counter[value] > 0) {
      counter[value]++;
    } else {
      counter[value] = 1;
    }
  }

  if (counter["*"] === undefined) return 0;
  return counter["*"];
};

export default updateSpecificity;
