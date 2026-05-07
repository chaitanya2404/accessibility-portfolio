"use client";

import { Children, isValidElement, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useAnnounce } from "@/components/LiveRegion";
import { Column, type ColumnProps } from "./Column";
import { DEFAULT_STATE, type ColumnDef, type DataTableState } from "./types";

type DataTableProps<T> = {
  rows: ReadonlyArray<T>;
  rowKey: (row: T) => string;
  caption: React.ReactNode;
  state?: DataTableState;
  defaultState?: Partial<DataTableState>;
  onStateChange?: (next: DataTableState) => void;
  pageSize?: number;
  selectable?: boolean;
  emptyMessage?: React.ReactNode;
  children: React.ReactNode;
};

function extractColumns<T>(children: React.ReactNode): ColumnDef<T>[] {
  const cols: ColumnDef<T>[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Column) {
      cols.push(child.props as unknown as ColumnProps<T>);
    }
  });
  return cols;
}

function compareValues(a: string | number, b: string | number, direction: "asc" | "desc") {
  if (typeof a === "number" && typeof b === "number") {
    return direction === "asc" ? a - b : b - a;
  }
  const av = String(a).toLowerCase();
  const bv = String(b).toLowerCase();
  if (av < bv) return direction === "asc" ? -1 : 1;
  if (av > bv) return direction === "asc" ? 1 : -1;
  return 0;
}

export function DataTable<T>({
  rows,
  rowKey,
  caption,
  state: controlled,
  defaultState,
  onStateChange,
  pageSize = 5,
  selectable = false,
  emptyMessage = "No rows match.",
  children,
}: DataTableProps<T>) {
  const announce = useAnnounce();
  const lastShiftIndex = useRef<number | null>(null);

  const [internal, setInternal] = useState<DataTableState>(() => ({
    ...DEFAULT_STATE,
    ...defaultState,
  }));
  const state = controlled ?? internal;

  const setState = (next: DataTableState) => {
    if (controlled === undefined) setInternal(next);
    onStateChange?.(next);
  };

  const columns = useMemo(() => extractColumns<T>(children), [children]);

  const filtered = useMemo(() => {
    if (!state.search.trim()) return rows;
    const q = state.search.trim().toLowerCase();
    return rows.filter((row) =>
      columns.some((c) => {
        const v = c.value ? String(c.value(row)) : String(c.cell(row) ?? "");
        return v.toLowerCase().includes(q);
      })
    );
  }, [rows, columns, state.search]);

  const sorted = useMemo(() => {
    if (!state.sort) return filtered;
    const col = columns.find((c) => c.id === state.sort?.id);
    if (!col) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = col.value ? col.value(a) : String(col.cell(a) ?? "");
      const bv = col.value ? col.value(b) : String(col.cell(b) ?? "");
      return compareValues(av as string | number, bv as string | number, state.sort!.direction);
    });
    return copy;
  }, [filtered, columns, state.sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(state.page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(pageStart, pageStart + pageSize);

  const allSelectableKeys = sorted.map(rowKey);
  const selected = new Set(state.selectedKeys);
  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.has(rowKey(r)));

  const onSort = (id: string) => {
    if (state.sort?.id === id) {
      setState({
        ...state,
        sort: { id, direction: state.sort.direction === "asc" ? "desc" : "asc" },
      });
    } else {
      setState({ ...state, sort: { id, direction: "asc" } });
    }
  };

  const onPage = (next: number) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    if (clamped === safePage) return;
    setState({ ...state, page: clamped });
    announce(`Page ${clamped} of ${totalPages}.`, "polite");
  };

  const toggleRow = (
    rowIdx: number,
    key: string,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    let nextKeys: string[];
    if (event && "shiftKey" in event && event.shiftKey && lastShiftIndex.current != null) {
      const start = Math.min(lastShiftIndex.current, rowIdx);
      const end = Math.max(lastShiftIndex.current, rowIdx);
      const rangeKeys = pageRows.slice(start, end + 1).map(rowKey);
      const merged = new Set(selected);
      const target = !rangeKeys.every((k) => merged.has(k));
      for (const k of rangeKeys) {
        if (target) merged.add(k);
        else merged.delete(k);
      }
      nextKeys = [...merged];
    } else {
      const merged = new Set(selected);
      if (merged.has(key)) merged.delete(key);
      else merged.add(key);
      nextKeys = [...merged];
    }
    lastShiftIndex.current = rowIdx;
    setState({ ...state, selectedKeys: nextKeys });
    announce(
      `${nextKeys.length} of ${allSelectableKeys.length} row${
        nextKeys.length === 1 ? "" : "s"
      } selected.`,
      "polite"
    );
  };

  const toggleAllOnPage = () => {
    const merged = new Set(selected);
    if (allOnPageSelected) {
      for (const r of pageRows) merged.delete(rowKey(r));
    } else {
      for (const r of pageRows) merged.add(rowKey(r));
    }
    const next = [...merged];
    setState({ ...state, selectedKeys: next });
    announce(`${next.length} of ${allSelectableKeys.length} rows selected.`, "polite");
  };

  return (
    <div className="space-y-3">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-wrap items-center justify-between gap-2 text-sm text-fg-muted"
      >
        <p>
          Showing {sorted.length === 0 ? 0 : pageStart + 1}–
          {Math.min(pageStart + pageRows.length, sorted.length)} of {sorted.length}
        </p>
        {selectable && state.selectedKeys.length > 0 ? (
          <p className="font-medium text-fg">
            {state.selectedKeys.length} selected
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg border border-divider">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-divider bg-surface-raised px-4 py-3 text-left font-semibold text-fg">
            {caption}
          </caption>
          <thead className="bg-surface-raised text-fg-muted">
            <tr>
              {selectable ? (
                <th
                  scope="col"
                  className="border-b border-divider px-3 py-3 text-center"
                  aria-label="Select rows"
                >
                  <input
                    type="checkbox"
                    aria-label={
                      allOnPageSelected ? "Deselect all on page" : "Select all on page"
                    }
                    checked={allOnPageSelected}
                    onChange={toggleAllOnPage}
                  />
                </th>
              ) : null}
              {columns.map((col) => {
                const isSorted = state.sort?.id === col.id;
                const ariaSort: "ascending" | "descending" | "none" = isSorted
                  ? state.sort!.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
                const Icon = !isSorted
                  ? ArrowUpDown
                  : state.sort!.direction === "asc"
                    ? ArrowUp
                    : ArrowDown;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    aria-sort={col.sortable ? ariaSort : undefined}
                    className={clsx(
                      "border-b border-divider px-4 py-3 font-semibold",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.id)}
                        className={clsx(
                          "inline-flex items-center gap-1 text-fg-muted hover:text-fg",
                          col.align === "right" && "flex-row-reverse"
                        )}
                      >
                        <span>{col.label}</span>
                        <Icon
                          aria-hidden="true"
                          className={clsx(
                            "h-3.5 w-3.5",
                            isSorted ? "text-fg" : "text-fg-subtle"
                          )}
                        />
                        <span className="sr-only">
                          {isSorted
                            ? state.sort!.direction === "asc"
                              ? ", sorted ascending. Activate to sort descending."
                              : ", sorted descending. Activate to sort ascending."
                            : ", not sorted. Activate to sort ascending."}
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-6 text-center text-fg-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => {
                const key = rowKey(row);
                const isSelected = selected.has(key);
                return (
                  <tr
                    key={key}
                    aria-rowindex={pageStart + idx + 1}
                    aria-selected={selectable ? isSelected : undefined}
                    className={clsx(
                      "border-b border-divider/60 last:border-0",
                      isSelected ? "bg-accent-soft" : "hover:bg-surface-raised"
                    )}
                  >
                    {selectable ? (
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${pageStart + idx + 1}`}
                          checked={isSelected}
                          onClick={(e) => toggleRow(idx, key, e)}
                          onChange={() => undefined}
                        />
                      </td>
                    ) : null}
                    {columns.map((col, i) => (
                      <td
                        key={col.id}
                        className={clsx(
                          "px-4 py-3 text-fg",
                          col.align === "right" && "text-right tabular-nums",
                          i === 0 && "font-medium"
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between gap-3 text-sm"
        >
          <button
            type="button"
            onClick={() => onPage(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-md border border-divider px-3 py-1.5 text-fg hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-fg-muted" aria-live="off">
            Page {safePage} of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => onPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="rounded-md border border-divider px-3 py-1.5 text-fg hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}

DataTable.Column = Column;
