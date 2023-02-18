import { useEffect, useState } from "react";

export function useLocalStorage(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => {
    return localStorage.getItem(key) ?? defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
