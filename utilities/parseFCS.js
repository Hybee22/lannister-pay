import compare from "./compare.js"; // Sorting
import updateSpecificity from "./updateSpecificity.js";

const parseFCS = (input, prop = null) => {
  const FCSArr = input.split("\n");

  const output = FCSArr.map((FCS) => {
    const [first, second] = FCS.split(/:(.+)/); // split at first occurence of ":" incase a flat_perc is used
    const main = first.trimEnd();
    const apply = second.trimStart();

    const [id, currency, locale, entity] = main.split(" ");
    const [, type, value] = apply.split(" ");
    const [entityType, entityProp] = entity.split("("); // CREDIT-CARD (VISA) => [CREDIT_CARD, VISA)]
    const entityProperty = prop || entityProp.slice(0, -1);

    let specificityCounter = updateSpecificity([
      currency,
      locale,
      entityType,
      entityProperty,
    ]);

    let parsedValue;
    if (type === "FLAT_PERC") {
      const [flat, perc] = value.split(":");
      parsedValue = [Number(flat), Number(perc)];
    } else {
      parsedValue = Number(value);
    }

    return {
      "FEE-ID": id,
      "FEE-CURRENCY": currency,
      "FEE-LOCALE": locale,
      "FEE-ENTITY-TYPE": entityType,
      "FEE-ENTITY-PROPERTY": entityProperty,
      "FEE-TYPE": type,
      "FEE-VALUE": parsedValue,
      "SPECIFICITY-COUNT": specificityCounter,
    };
  });

  return output.sort(compare);
};

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

export default parseFCS;
