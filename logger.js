import fs from "fs";
import winston from "winston";
const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint } = format;

// // eslint-disable-next-line no-multi-assign
const Logger = {};

const level = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.Console()],
});

const getCallerFile = () => {
  const originalFunc = Error.prepareStackTrace;

  let callerFile;
  let errObj = null;
  let functionName;
  let lineNumber;
  try {
    const err = new Error();

    Error.prepareStackTrace = (errStack, stack) => {
      return stack;
    };

    const currentFile = err.stack.shift().getFileName();

    while (err.stack.length) {
      errObj = err.stack.shift();
      callerFile = errObj.getFileName();

      if (currentFile !== callerFile) break;
    }
    if (errObj) {
      lineNumber = errObj.getLineNumber();
      functionName = errObj.getFunctionName();
    } else {
      lineNumber = err.stack.shift().getLineNumber();
      functionName = err.stack.shift().getFunctionName();
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return { callerFile, lineNumber, functionName };
};

if (!fs.existsSync("Logger")) {
  fs.mkdirSync("Logger");
}
const infoStream = fs.createWriteStream("Logger/info.log", { flags: "a" });
const errorStream = fs.createWriteStream("Logger/error.log", { flags: "a" });
const debugStream = fs.createWriteStream("Logger/debug.log", { flags: "a" });
const criticalStream = fs.createWriteStream("Logger/critical.log", {
  flags: "a",
});

Logger.info = (msg) => {
  const [date, time] = new Date().toISOString().split("T");
  const message = `${date} ${time.slice(0, -1)} INFO ${level.info} --- ${
    module.parent.filename
  } : ${msg}\n`;
  logger.info(message);
  infoStream.write(message);
};

Logger.debug = (msg) => {
  const [date, time] = new Date().toISOString().split("T");
  const message = `${date} ${time.slice(0, -1)} DEBUG ${level.debug} --- ${
    module.parent.filename
  } : ${msg}\n`;
  logger.debug(message);
  debugStream.write(message);
};

Logger.error = (msg) => {
  // __filename.slice(__dirname.length + 1) -> get a filename
  const [date, time] = new Date().toISOString().split("T");
  const message = `${date} ${time.slice(0, -1)} ERROR ${level.error} --- ${
    getCallerFile().callerFile
  }:${getCallerFile().functionName}:${getCallerFile().lineNumber}: ${msg}\n`;
  logger.error(message);
  errorStream.write(message);
};

Logger.critical = (msg) => {
  const [date, time] = new Date().toISOString().split("T");
  const message = `${date} ${time.slice(0, -1)} CRITICAL ${level.info} --- ${
    module.children.filename
  } : ${msg}\n`;
  logger.crit(message);
  criticalStream.write(message);
};

export default Logger;
