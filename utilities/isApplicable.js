import compare from "./compare.js";

const isApplicable = (configArr, props) => {
  const arr = [];
  configArr.forEach((config) => {
    if (
      config["FEE-ENTITY-TYPE"] === props["TYPE"] ||
      config["FEE-ENTITY-TYPE"] === "*"
    ) {
      return arr.push(config);
    }
  });

  arr.map((config) => {
    if (
      (config["FEE-ENTITY-TYPE"] === props["TYPE"] &&
        config["FEE-ENTITY-PROPERTY"] === props["BRAND"]) ||
      config["FEE-ENTITY-PROPERTY"] === "*"
    ) {
      return config;
    }
  });

  const data = arr.map((config) => {
    if (
      config["FEE-LOCALE"] === props["LOCALE"] ||
      config["FEE-ENTITY-PROPERTY"] === "*"
    ) {
      return config;
    }
  });

  return data.sort(compare);
};

export default isApplicable;
