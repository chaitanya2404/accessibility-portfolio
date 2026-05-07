import type { ColumnDef } from "./types";

export type ColumnProps<T> = ColumnDef<T>;

/**
 * Marker component. DataTable extracts its props via React.Children.
 * Renders nothing on its own; the props parameter exists only so callers
 * get type-checked.
 */
export function Column<T>(props: ColumnProps<T>): null {
  void props;
  return null;
}
Column.displayName = "DataTable.Column";
