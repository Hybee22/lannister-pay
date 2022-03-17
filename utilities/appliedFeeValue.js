import isApplicable from "./isApplicable.js";

const appliedFeeValue = (configArr, transactionAmount, prop) => {
  const config = isApplicable(configArr, prop);

  const { CURRENCY } = prop;

  if (config.length === 0) {
    return {
      appliedFee: "",
      feeId: "",
      message: "No applicable configuration",
    };
  }

  const selectedConfig = config[0];

  if (selectedConfig["FEE-CURRENCY"] !== CURRENCY) {
    return {
      appliedFee: "",
      feeId: "",
      message: `No fee configuration for ${CURRENCY} transactions.`,
    };
  }

  const feeId = selectedConfig["FEE-ID"];

  if (selectedConfig["FEE-TYPE"] === "PERC") {
    return {
      appliedFee: (selectedConfig["FEE-VALUE"] / 100) * transactionAmount,
      feeId,
      message: "",
    };
  }
  if (selectedConfig["FEE-TYPE"] === "FLAT") {
    return {
      appliedFee: selectedConfig["FEE-VALUE"],
      feeId,
      message: "",
    };
  }
  if (selectedConfig["FEE-TYPE"] === "FLAT_PERC") {
    const [flat, perc] = selectedConfig["FEE-VALUE"];
    return {
      appliedFee: flat + (perc / 100) * transactionAmount,
      feeId,
      message: "",
    };
  }
};

export default appliedFeeValue;
