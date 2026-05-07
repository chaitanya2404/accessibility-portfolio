"use client";

import { forwardRef, useId } from "react";
import clsx from "clsx";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  /**
   * If you don't pass an `id`, an auto-generated one is used so a
   * <label htmlFor> still works out of the box.
   */
  id?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  className?: string;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onCheckedChange, id, disabled, className, ...aria },
  ref
) {
  const generatedId = useId();
  const finalId = id ?? generatedId;

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // role=switch follows the button keyboard model: Space toggles, Enter toggles.
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (!disabled) onCheckedChange(!checked);
    }
  };

  return (
    <button
      ref={ref}
      id={finalId}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      onKeyDown={onKeyDown}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
        checked ? "bg-accent" : "bg-fg-subtle/30",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...aria}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
});
