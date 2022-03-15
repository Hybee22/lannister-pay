const compare = (a, b) => {
  const specA = a["SPECIFICITY-COUNT"];
  const specB = b["SPECIFICITY-COUNT"];

  let comparison = 0;
  if (specA > specB) comparison = 1;
  else if (specA < specB) comparison = -1;

  return comparison;
};

export default compare;
