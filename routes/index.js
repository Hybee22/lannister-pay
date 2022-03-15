import feesRouter from "./fees/index.js";

export default (app) => {
  app.use("/v1", feesRouter);
};
