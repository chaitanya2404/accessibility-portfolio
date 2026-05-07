import clsx from "clsx";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
}) {
  return (
    <Tag
      className={clsx(
        "rounded-lg border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </Tag>
  );
}
