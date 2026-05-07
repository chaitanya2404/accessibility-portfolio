export type SortDirection = "asc" | "desc";

export type DataTableState = {
  sort: { id: string; direction: SortDirection } | null;
  page: number;
  search: string;
  selectedKeys: ReadonlyArray<string>;
};

export const DEFAULT_STATE: DataTableState = {
  sort: null,
  page: 1,
  search: "",
  selectedKeys: [],
};

export type ColumnDef<T> = {
  id: string;
  label: string;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  numeric?: boolean;
  align?: "left" | "right";
  /**
   * Pull a comparable value for sorting / searching. Defaults to the rendered
   * cell as a lowercased string when the cell is a primitive.
   */
  value?: (row: T) => string | number;
};
