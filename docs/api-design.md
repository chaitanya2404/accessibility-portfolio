# API design — composition over configuration

The DataTable in this portfolio uses a compound API. This is a deliberate choice with tradeoffs.

## What we picked

```tsx
<DataTable rows={data} rowKey={r => r.id} caption="Staff" state={s} onStateChange={set} pageSize={5} selectable>
  <DataTable.Column id="name" label="Name" sortable cell={r => r.name} />
  <DataTable.Column id="role" label="Role" sortable cell={r => r.role} />
</DataTable>
```

Columns are declared as children. `DataTable` walks `React.Children` to extract column definitions. The renderer owns the `<table>`, `<thead>`, `<tbody>`, sort state, pagination, and selection.

## Alternatives considered

### Pure prop bag
```tsx
<DataTable
  rows={data}
  columns={[
    { id: "name", label: "Name", sortable: true, cell: r => r.name },
  ]}
/>
```
Simpler internally. But the column type expands quickly: `headerRender`, `footerRender`, `meta`, `align`, `width`, `sortFn`. A prop bag becomes a config object over time.

### Render props on the table
```tsx
<DataTable rows={data}>
  {({ rows, sort }) => (
    <table>...</table>
  )}
</DataTable>
```
Most flexible, least guidance. Consumers re-implement the entire `<table>` shell, including all of the a11y wiring. No.

## Why compound won

- **Visual proximity.** A column's label, accessor, and sort hint live in one place in the JSX, where consumers' eyes are already.
- **Static analysis.** Column ids are visible in source; renaming `name` is a Find-Replace.
- **Forward compatibility.** New per-column features (e.g. `groupId`, `aggregator`) become props on `<DataTable.Column>`. Existing consumers don't see them.
- **Renderer keeps control.** Sort buttons, `aria-sort`, `<th scope=col>`, pagination labels — all live inside the library and stay correct. Consumers can't accidentally drop the `caption`.

## Where it falls short

- **TypeScript inference on generic children.** `DataTable<Framework>` then `DataTable.Column<Framework>` is verbose. We accept this; the alternative is generic prop bags which lose Column-prop type narrowing.
- **Dynamic columns.** Building columns from a runtime list still works (map over an array, render a Column for each), but you lose the visual proximity benefit for that case.

## Convention

If there's exactly one shape the consumer needs to provide, use props. If there are multiple "things" of the same shape, use compound children. DataTable has many columns — compound. ResultsTable has a fixed shape — props.
