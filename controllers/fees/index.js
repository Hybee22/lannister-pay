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
        Customer: { BearsFee },
        PaymentEntity,
      } = req.body;
      const { Type } = PaymentEntity;

      const keyId = redisKeys.getHashKey(`config`);

      const configArr = await cache.get(keyId);

      if (!configArr) {
        return errorResMsg(res, 400, {
          message: "No fee configurations found",
        });
      }

      const { appliedFee, feeId } = appliedFeeValue(configArr, Amount, {
        TYPE: Type,
      });

      let ChargeAmount;
      if (BearsFee === true) {
        ChargeAmount = Amount + appliedFee;
      } else {
        ChargeAmount = Amount;
      }

      const SettlementAmount = ChargeAmount - appliedFee;

      return successResMsg(res, 200, {
        AppliedFeeId: feeId,
        AppliedFeeIdValue: appliedFee,
        ChargeAmount,
        SettlementAmount,
      });
    } catch (error) {
      logger.error(error);
      await cache.flushAll();
      return errorResMsg(res, 500, {
        message: "Something went wrong while computing transaction fee",
      });
    }
  }
}

export default new FeesController();