"use client";

import { useEffect, useRef } from "react";

export function useStepFocus<T extends HTMLElement>(stepKey: string | number) {
  const ref = useRef<T>(null);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    ref.current?.focus({ preventScroll: false });
  }, [stepKey]);

  return ref;
}
