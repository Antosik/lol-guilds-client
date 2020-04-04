import type { IRPCHandlerResponse } from "../interfaces/IRPCHandler";


export const flowId = "flow";

export function constructResult(promiseOrData: any | Promise<any>): Promise<IRPCHandlerResponse> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return Promise.resolve(promiseOrData)
    .then((data: any) => ({ status: "ok", notification: data?.notification, data }) as IRPCHandlerResponse)  // eslint-disable-line @typescript-eslint/no-explicit-any
    .catch((e: Error) => ({ status: "error", notification: e.message }) as IRPCHandlerResponse);
}