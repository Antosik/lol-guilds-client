export async function wait(ms: number): Promise<unknown> {
  return new Promise(res => setTimeout(res, ms));
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function throttle(callback: TAnyFunc, limit: number = 1000): TAnyFunc {
  let timed = false;
  return function () {
    if (!timed) {
      callback();
      timed = true;
      setTimeout(function () {
        timed = false;
      }, limit);
    }
  };
}

export function debounce(func: TAnyFunc, delay: number = 1000): TAnyFunc {
  let timer: NodeJS.Timer;
  return function() {
    clearTimeout(timer);
	  timer = setTimeout(func, delay);
  };
}