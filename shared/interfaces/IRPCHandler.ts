export interface IRPCHandlerResult {
  status: "ok" | "error";
  notification?: string;
  data?: unknown;
}