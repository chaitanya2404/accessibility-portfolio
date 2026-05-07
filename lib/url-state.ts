"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type Codec<T> = {
  parse: (value: string | null) => T;
  serialize: (value: T) => string | null;
};

export const codecs = {
  string(defaultValue: string): Codec<string> {
    return {
      parse: (v) => v ?? defaultValue,
      serialize: (v) => (v === defaultValue ? null : v),
    };
  },
  int(defaultValue: number): Codec<number> {
    return {
      parse: (v) => {
        if (v == null) return defaultValue;
        const n = Number.parseInt(v, 10);
        return Number.isFinite(n) ? n : defaultValue;
      },
      serialize: (v) => (v === defaultValue ? null : String(v)),
    };
  },
  oneOf<const Options extends readonly string[]>(
    options: Options,
    defaultValue: Options[number]
  ): Codec<Options[number]> {
    return {
      parse: (v) => {
        if (v && (options as readonly string[]).includes(v)) {
          return v as Options[number];
        }
        return defaultValue;
      },
      serialize: (v) => (v === defaultValue ? null : v),
    };
  },
};

export function useUrlParam<T>(
  key: string,
  codec: Codec<T>
): readonly [T, (next: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(
    () => codec.parse(searchParams.get(key)),
    [codec, key, searchParams]
  );

  const setValue = useCallback(
    (next: T) => {
      const serialized = codec.serialize(next);
      const params = new URLSearchParams(searchParams.toString());
      if (serialized == null) {
        params.delete(key);
      } else {
        params.set(key, serialized);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [codec, key, pathname, router, searchParams]
  );

  return [value, setValue] as const;
}

export function readSearchParam<T>(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key: string,
  codec: Codec<T>
): T {
  const raw = searchParams?.[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return codec.parse(value ?? null);
}
