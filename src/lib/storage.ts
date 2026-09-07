const PREFIX = "studyai:";

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export const Storage = {
  get<T>(key: string, fallback: T): T {
    return safe(() => {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    }, fallback);
  },
  set<T>(key: string, value: T): boolean {
    return safe(() => {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    }, false);
  },
  remove(key: string): boolean {
    return safe(() => {
      localStorage.removeItem(PREFIX + key);
      return true;
    }, false);
  },
  clear(): boolean {
    return safe(() => {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
      return true;
    }, false);
  },
};
