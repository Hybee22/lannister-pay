import redisKeys from "../../redis/key-gen.js";
import { errorResMsg, successResMsg } from "../../utilities/response.js";
import parseFCS from "../../utilities/parseFCS.js";
import Logger from "../../logger.js";
import cache from "../../utilities/cache.js";
import appliedFeeValue from "./../../utilities/appliedFeeValue.js";

const logger = Logger;

class FeesController {
  async handleFeeConfig(req, res) {
    try {
      const { FeeConfigurationSpec } = req.body;
      // Parse Configuration string into array of donfiguration objects
      const data = parseFCS(FeeConfigurationSpec);
      // Generate a key to save the stringified configuration objects
      const keyId = redisKeys.getHashKey(`config`);

      // Set Config Data in Redis store
      await cache.set(keyId, data);
      // Return response
      return successResMsg(res, 200, { status: "ok" });
    } catch (error) {
      logger.error(error);
      await cache.flushAll();
      return errorResMsg(res, 500, {
        message: "Something went wrong while storing fee configuration",
      });
    }
  }

  async handleTransactionFee(req, res) {
    try {
      const {
        Amount,
        Currency,
        CurrencyCountry,
        Customer: { BearsFee },
        PaymentEntity,
      } = req.body;
      const { Type, Brand, Country } = PaymentEntity;

      const keyId = redisKeys.getHashKey(`config`);

      const configArr = await cache.get(keyId);

      let LOCALE;
      if (CurrencyCountry === Country) {
        LOCALE = "LOCL";
      } else {
        LOCALE = "INTL";
      }

      if (!configArr) {
        return errorResMsg(res, 400, {
          message: "No fee configurations found",
        });
      }

      const applied = appliedFeeValue(configArr, Amount, {
        TYPE: Type,
        BRAND: Brand,
        LOCALE: LOCALE,
        CURRENCY: Currency,
      });

      if (applied?.message?.length > 0) {
        return errorResMsg(res, 400, { Error: applied?.message });
      }

      let ChargeAmount;
      if (BearsFee === true) {
        ChargeAmount = Amount + applied?.appliedFee;
      } else {
        ChargeAmount = Amount;
      }

      const SettlementAmount = ChargeAmount - applied?.appliedFee;

      return successResMsg(res, 200, {
        AppliedFeeId: applied?.feeId,
        AppliedFeeIdValue: Math.round(applied?.appliedFee),
        ChargeAmount,
        SettlementAmount,
      });
    } catch (error) {
      console.log(error);
      logger.error(error);
      //   await cache.flushAll();
      return errorResMsg(res, 500, {
        message: "Something went wrong while computing transaction fee",
      });
    }
  }
}

export default new FeesController();
