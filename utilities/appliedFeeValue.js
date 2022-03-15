import isApplicable from "./isApplicable.js";

const appliedFeeValue = (configArr, transactionAmount, prop) => {
  console.log(configArr);
  const config = isApplicable(configArr, prop)[0];
  const feeId = config["FEE-ID"];

  if (config["FEE-TYPE"] === "PERC") {
    return {
      appliedFee: (config["FEE-VALUE"] / 100) * transactionAmount,
      feeId,
    };
  }
  if (config["FEE-TYPE"] === "FLAT") {
    return {
      appliedFee: config["FEE-VALUE"],
      feeId,
    };
  }
  if (config["FEE-TYPE"] === "FLAT_PERC") {
    const [flat, perc] = config["FEE-VALUE"];
    return {
      appliedFee: flat + (perc / 100) * transactionAmount,
      feeId,
    };
  }
};

export default appliedFeeValue;
