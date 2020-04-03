import type { IRPCHandlerResult } from "../interfaces/IRPCHandler";


export const flowId = "flow";

export function constructResult(promiseOrData: any | Promise<any>): Promise<IRPCHandlerResult> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return Promise.resolve(promiseOrData)
    .then((data: any) => ({ status: "ok", notification: data?.notification, data }) as IRPCHandlerResult)  // eslint-disable-line @typescript-eslint/no-explicit-any
    .catch((e: Error) => ({ status: "error", notification: e.message }) as IRPCHandlerResult);
}