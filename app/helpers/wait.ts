export const wait = async (ms: number): Promise<unknown> =>
  new Promise(res => setTimeout(res, ms));