import { useCallback, useSyncExternalStore } from "react";

const SETTINGS_EVENT = "argus-settings-change";

function subscribe(callback: () => void): () => void {
  window.addEventListener(SETTINGS_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SETTINGS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useSettings<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const getSnapshot = useCallback(() => {
    const stored = localStorage.getItem(key);

    return stored ?? null;
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value: T = raw !== null ? (JSON.parse(raw) as T) : defaultValue;

  const setValue = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
    },
    [key],
  );

  return [value, setValue];
}
