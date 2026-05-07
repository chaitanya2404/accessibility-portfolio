# Screen reader testing matrix

A real testing matrix names the combinations and the divergences. Pasting "tested with NVDA" into a README without specifics is a yellow flag for any reviewer who has actually paired with assistive tech.

## Combinations targeted

| Reader | Browser | OS | Status |
|---|---|---|---|
| NVDA | Firefox | Windows 11 | Primary target. Browse mode. |
| NVDA | Chrome | Windows 11 | Spot checks. Forms-mode interactions identical. |
| JAWS | Chrome | Windows 11 | Spot checks. See divergence notes below. |
| VoiceOver | Safari | macOS 14 | Primary target. |
| VoiceOver | Chrome | macOS 14 | Spot checks. Some live region timing differs from Safari. |
| TalkBack | Chrome | Android 14 | Spot checks for swipe-navigation through the staff table and dialogs. |

## Known divergences

### Sort state announcement
- **NVDA** announces `aria-sort="ascending"` as "sorted ascending" on header focus.
- **JAWS** in browse mode also announces it; in forms mode (auto-entered when a button is focused) JAWS does not announce `aria-sort`. Workaround: the sort-button text includes a sr-only suffix repeating the sort state, so JAWS forms mode users still hear it.
- **VoiceOver** announces "ascending" only on initial focus, not on re-focus after activation. Acceptable; the live region announcement of "sorted by Name ascending" covers the gap.

### Live region timing
- **VoiceOver Safari** queues messages aggressively; back-to-back identical messages may be dropped. The provider re-keys with a 4s timeout so identical messages re-announce.
- **TalkBack** announces polite messages immediately; assertive messages also play immediately but interrupt the current utterance.

### Dialog focus return
All readers correctly hear the trigger label on close because Radix moves focus back. No divergence observed.

## Recording slots

Audio recordings of representative interactions are placeholders the user records locally. Each placeholder names the script, the reader, and the expected announcements; the recording goes in `docs/recordings/` and the URL replaces the placeholder.

- `[Modal open + close — NVDA + Firefox]` (placeholder)
- `[Combobox filter + select — VoiceOver + Safari]` (placeholder)
- `[Toast announcement — NVDA + Chrome]` (placeholder)

## Test scripts (so the recording has a known shape)

### Modal
1. Tab to "Open dialog" trigger.
2. Press Enter.
3. Expect: "Confirm subscription, dialog. You will receive a monthly digest of accessibility links. You can unsubscribe from any email."
4. Tab through Email, Cancel, Subscribe, Close.
5. Press Esc.
6. Expect focus to return to "Open dialog" with that label re-announced.

### Combobox
1. Tab to the input.
2. Type "rem".
3. Expect "Combobox, Search frameworks, expanded, 1 of 1, Remix" (NVDA-style) or VoiceOver equivalent.
4. Press Down + Enter.
5. Expect the live region to announce "Selected: Remix".

### Toast
1. Tab to "Show toast" button.
2. Press Enter.
3. Expect: "Settings saved. Your preferences will sync to other devices in a moment." (announced without focus moving).
4. Press F6 to reach the toast viewport.
5. Tab between Undo and Close; press Esc to dismiss.
