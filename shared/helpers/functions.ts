export async function wait(ms: number): Promise<unknown> {
  return new Promise(res => setTimeout(res, ms));
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}