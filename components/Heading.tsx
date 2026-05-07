import clsx from "clsx";
import { JSX } from "react";

type Level = 1 | 2 | 3 | 4;

const sizes: Record<Level, string> = {
  1: "text-4xl font-bold tracking-tight sm:text-5xl",
  2: "text-2xl font-semibold tracking-tight sm:text-3xl",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
};

export function Heading({
  level,
  children,
  className,
  id,
}: {
  level: Level;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag id={id} className={clsx(sizes[level], "text-slate-900", className)}>
      {children}
    </Tag>
  );
}
