# Focus management strategy

Focus is a shared resource across the page. Our rule: **focus moves only when the user has materially changed context.** Anything else is noise — a moving focus ring is jarring for keyboard users, and unsolicited focus changes disorient screen reader users mid-thought.

## When focus moves

- **Skip link activated.** Focus jumps to `#main-content`. The user explicitly asked to bypass nav.
- **Sidebar anchor in the Components page.** Click moves focus into the target section so AT users hear the section heading.
- **Wizard step changes.** `useStepFocus` moves focus to the new step heading. Without this, AT users on step 2 still hear "step 1" landmarks.
- **Service request submit succeeds.** Focus returns to the success heading; toast announces in parallel.
- **Dialog opens.** Radix traps focus inside. On close, Radix returns focus to the originating trigger.

## When focus does not move

- **Sort, filter, search, or pagination on the data table.** The user's hand is on the keyboard already; we do not steal focus. The result count change is announced via the polite live region instead.
- **Toast appears.** Toast viewport is a live region; focus stays where the user put it. F6 reaches the viewport on demand.
- **Tab change in Radix Tabs.** Focus stays on the activated tab; arrow keys keep working.

## How route transitions handle focus

Next App Router moves focus to the route announcer (`__next-route-announcer__`) by default. We do not override this. If a route deliberately wants to send focus elsewhere (e.g. to the page's `h1`), it does so in a `useEffect` after mount.

## The skip link

The skip link is the first focusable element in the layout. It is visually hidden until focused, then absolutely positioned at the top-left. The `:focus` CSS rules live in `globals.css` so the link survives any wrapper style changes.

## Live regions

A single `LiveRegionProvider` mounts in the root layout and exposes `announce(message, priority)`. Components do **not** add their own `aria-live` divs. Centralizing means:

- Predictable ordering across NVDA/JAWS/VoiceOver.
- One place to debug "why was this announced twice".
- A consistent re-keying behavior so identical messages back-to-back still announce.

When a component needs visible status text alongside the AT announcement, it renders a *visible* `role=status` element next to the content while still calling `announce()`. The dual rendering is intentional: visual users need a mirror.
