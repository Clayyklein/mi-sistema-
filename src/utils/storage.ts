export type StorageResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function safeJsonParse<T>(raw: string): StorageResult<T> {
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "parse_error" };
  }
}

export function loadFromStorage<T>(key: string): StorageResult<T | null> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ok: true, value: null };
    const parsed = safeJsonParse<T>(raw);
    if (!parsed.ok) return parsed;
    return { ok: true, value: parsed.value };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "storage_error" };
  }
}

export function saveToStorage<T>(key: string, value: T): StorageResult<true> {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { ok: true, value: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "storage_error" };
  }
}

