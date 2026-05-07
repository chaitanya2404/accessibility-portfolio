"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import clsx from "clsx";
import type { Staff } from "../data";

type SortKey = keyof Staff;
type Direction = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align?: "left" | "right" }[] = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
  { key: "extension", label: "Extension", align: "right" },
];

export function StaffTable({
  staff,
  departmentName,
}: {
  staff: Staff[];
  departmentName: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [direction, setDirection] = useState<Direction>("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return staff;
    const copy = [...staff];
    copy.sort((a, b) => {
      if (sortKey === "extension") {
        const an = Number.parseInt(a.extension, 10);
        const bn = Number.parseInt(b.extension, 10);
        return direction === "asc" ? an - bn : bn - an;
      }
      const av = a[sortKey].toLowerCase();
      const bv = b[sortKey].toLowerCase();
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [staff, sortKey, direction]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">
          {departmentName} staff directory. Use the column header buttons to
          sort by name, role, email, or extension.
        </caption>
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            {COLUMNS.map(({ key, label, align }) => {
              const isSorted = sortKey === key;
              const ariaSort: "ascending" | "descending" | "none" = isSorted
                ? direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none";
              const Icon = !isSorted
                ? ArrowUpDown
                : direction === "asc"
                  ? ArrowUp
                  : ArrowDown;
              return (
                <th
                  key={key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={clsx(
                    "border-b border-slate-200 px-4 py-3 font-semibold",
                    align === "right" && "text-right"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSort(key)}
                    className={clsx(
                      "inline-flex items-center gap-1 rounded-sm text-slate-700 hover:text-slate-900",
                      align === "right" && "flex-row-reverse"
                    )}
                  >
                    <span>{label}</span>
                    <Icon
                      aria-hidden="true"
                      className={clsx(
                        "h-3.5 w-3.5",
                        isSorted ? "text-slate-900" : "text-slate-400"
                      )}
                    />
                    <span className="sr-only">
                      {isSorted
                        ? direction === "asc"
                          ? ", sorted ascending. Activate to sort descending."
                          : ", sorted descending. Activate to sort ascending."
                        : ", not sorted. Activate to sort ascending."}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.email}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
            >
              <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
              <td className="px-4 py-3 text-slate-700">{row.role}</td>
              <td className="px-4 py-3">
                <a
                  href={`mailto:${row.email}`}
                  className="text-indigo-700 hover:text-indigo-900"
                >
                  <span className="sr-only">Email {row.name} at </span>
                  {row.email}
                </a>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                <span className="sr-only">Extension </span>
                {row.extension}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
