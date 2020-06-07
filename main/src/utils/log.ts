import Log, { error, debug, info } from "electron-log";
import { join as joinPath } from "path";

Log.transports.file.resolvePath = function(variables, message) {
  const level = message?.level ?? "debug";
  return joinPath(variables.libraryDefaultDir, `${level}.${variables.fileName ?? "log"}`);
};

export { error as logError, debug as logDebug, info as logInfo };
export default Log;