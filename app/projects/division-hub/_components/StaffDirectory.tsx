"use client";

import { DataTable, DEFAULT_STATE, type DataTableState } from "@/components/data-table";
import { codecs, useUrlParam } from "@/lib/url-state";
import type { Staff } from "../data";

export function StaffDirectory({
  staff,
  departmentName,
}: {
  staff: ReadonlyArray<Staff>;
  departmentName: string;
}) {
  const [sortKey, setSortKey] = useUrlParam(
    "sort",
    codecs.string("")
  );
  const [direction, setDirection] = useUrlParam(
    "dir",
    codecs.oneOf(["asc", "desc"] as const, "asc")
  );
  const [page, setPage] = useUrlParam("page", codecs.int(1));
  const [search, setSearch] = useUrlParam("q", codecs.string(""));

  const state: DataTableState = {
    sort: sortKey ? { id: sortKey, direction } : null,
    page,
    search,
    selectedKeys: [],
  };

  const handleStateChange = (next: DataTableState) => {
    if (next.sort) {
      if (next.sort.id !== sortKey) setSortKey(next.sort.id);
      if (next.sort.direction !== direction) setDirection(next.sort.direction);
    } else if (sortKey) {
      setSortKey("");
    }
    if (next.page !== page) setPage(next.page);
    if (next.search !== search) setSearch(next.search);
  };

  return (
    <div className="space-y-3">
      <label htmlFor="staff-search" className="sr-only">
        Filter staff
      </label>
      <input
        id="staff-search"
        type="search"
        placeholder="Filter by name, role, or extension…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          if (page !== 1) setPage(1);
        }}
        className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm focus-visible:border-accent"
      />
      <DataTable<Staff>
        rows={staff}
        rowKey={(s) => s.email}
        caption={`${departmentName} staff directory. Sort and filter state lives in the URL.`}
        state={state}
        onStateChange={handleStateChange}
        pageSize={5}
        emptyMessage="No staff match this filter."
      >
        <DataTable.Column<Staff>
          id="name"
          label="Name"
          sortable
          cell={(s) => s.name}
        />
        <DataTable.Column<Staff>
          id="role"
          label="Role"
          sortable
          cell={(s) => s.role}
        />
        <DataTable.Column<Staff>
          id="email"
          label="Email"
          cell={(s) => (
            <a
              href={`mailto:${s.email}`}
              className="text-accent hover:text-accent-strong"
            >
              <span className="sr-only">Email {s.name} at </span>
              {s.email}
            </a>
          )}
          value={(s) => s.email}
        />
        <DataTable.Column<Staff>
          id="extension"
          label="Extension"
          sortable
          align="right"
          value={(s) => Number.parseInt(s.extension, 10)}
          cell={(s) => (
            <>
              <span className="sr-only">Extension </span>
              {s.extension}
            </>
          )}
        />
      </DataTable>
    </div>
  );
}

export const _DEFAULT_STATE = DEFAULT_STATE;
