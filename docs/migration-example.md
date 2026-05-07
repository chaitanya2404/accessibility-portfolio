# Migration guide format

A sample MIGRATION.md showing how a breaking change to the Modal API would be communicated. This is what consumers want to find on day 1.

---

## Modal v2 → v3

**Released:** TBD · **Severity:** Breaking · **Scope:** Components > Dialog

### What changed

The `Dialog.Title` and `Dialog.Description` are now required. Dialogs without them previously rendered without `aria-labelledby` / `aria-describedby` and silently dropped a WCAG criterion. v3 throws at dev time.

```diff
 <Dialog.Root>
   <Dialog.Trigger>Open</Dialog.Trigger>
   <Dialog.Content>
+    <Dialog.Title>Confirm subscription</Dialog.Title>
+    <Dialog.Description>You will receive a monthly digest.</Dialog.Description>
     <p>...</p>
   </Dialog.Content>
 </Dialog.Root>
```

### Why

Screen readers were announcing dialogs with only the visible body text, missing the user's mental anchor. Title + description is what the WAI-ARIA pattern requires.

### Codemod

```bash
npx @portfolio/codemod modal-v3-titles
```

The codemod scans for `<Dialog.Content>` lacking `<Dialog.Title>` and inserts a placeholder with a comment. Authors review and fill in.

### Visually hidden titles

If the visible UI has a heading already (e.g. the dialog opens from a card whose title is the dialog's logical title), wrap the title in `<VisuallyHidden>` or pass `aria-labelledby` pointing at the existing element. Either is fine; the constraint is "AT must be able to find a name."

### Migration path

1. Run codemod (5 minutes).
2. Manually fill in placeholders for any dialog that takes user input — these need real titles, not generic ones.
3. Build. v3 throws at runtime in dev only if the title is empty after migration.
4. Update tests that assert on dialog structure to expect the new role wiring.

### Reverting

`npm i @portfolio/components@^2` pins back. The codemod is not reversible automatically.

### Contact

Open an issue with the `migration:modal-v3` label if you hit edge cases.
