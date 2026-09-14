export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, sandboxed iframe) */
  }
}

export function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}
