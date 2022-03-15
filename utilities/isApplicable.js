import compare from "./compare.js";

const isApplicable = (configArr, props) => {
  const arr = [];
  configArr.forEach((config) => {
    if (
      config["FEE-ENTITY-TYPE"] === (props["TYPE"] || "*") &&
      config["FEE-ENTITY-PROP"] === "*"
    ) {
      arr.push(config);
    }
    if (
      config["FEE-ENTITY-TYPE"] === (props["TYPE"] || "*") &&
      config["FEE-ENTITY-PROP"] !== "*"
    ) {
      arr.push(config);
    }
  });

  return arr.sort(compare);
};

export default isApplicable;
