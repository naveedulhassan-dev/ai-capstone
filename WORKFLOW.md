# Settings Form — Workflow Comparison (Round 1 vs Round 2)

## 1. Validation Edge Case Miss
**Round 1** only checks username length and email format. It ignores empty-field trims (spaces-only input passes), has no max-length limit, and validates nothing else — no password, phone, or file rules exist at all, so their edge cases are simply absent.
**Round 2** trims whitespace before checking, enforces min/max length, validates phone digit count (7–15), checks all five password rules individually, confirms password match, and caps bio at 200 characters — covering the edge cases Round 1 never considers.

## 2. Accessibility Issues
**Round 1** has no `aria-live`, `aria-invalid`, or `role="alert"` on error messages, so screen readers never announce validation failures. Labels exist but nothing signals focus state beyond the browser default, and there's no keyboard-visible focus ring styling.
**Round 2** adds `role="alert"` and `aria-live="polite"` on error/banner elements, sets `aria-invalid` on failing fields, and defines an explicit `:focus-visible` outline plus `prefers-reduced-motion` support.

## 3. Incorrect Error Handling
**Round 1** toggles error `display` directly with no `is-invalid` class on the input itself, so a red border or visual field-level cue never appears — only the text below shows. It also never re-validates on `input`, so a fixed value keeps showing the error until the next submit.
**Round 2** clears/sets error state on every keystroke, applies `is-invalid`/`is-valid` classes to the input, and shows a global banner separately from field errors so submit-level and field-level failures are distinguishable.

## 4. Invalid Input Accept Hona (Accepted Invalid Input)
**Round 1** accepts `"ab "` (padded to pass length via trailing spaces, since `.length` isn't trimmed), accepts any string in email local-part with no upper bound, and has no `maxlength` attribute — a 500-character username passes silently.
**Round 2** trims before length checks, restricts username to a character set (`a-zA-Z0-9_.`), enforces `maxlength` in the HTML, and rejects password/file inputs that Round 1 doesn't even ask for.

## 5. HTML/JS Issues
**Round 1** inlines both CSS and JS inside the HTML file, violating separation of concerns, uses no `id`-based error linkage beyond manual `style.display`, and has a single monolithic submit handler with no reusable functions.
**Round 2** splits HTML/CSS/JS into three files, organizes JS into named functions (`validateForm`, `showError`, `clearError`, `showSuccess`), and uses `addEventListener` throughout instead of inline handlers.

## 6. Mobile/Responsive Problem
**Round 1** has no media queries, no viewport-based layout adjustments, and fixed padding that doesn't adapt — inputs stay full width, but there's no responsive typography, stacking logic, or touch-friendly spacing.
**Round 2** includes breakpoints at 980px, 760px, and 420px, collapses the sidebar into a horizontal scroll nav, stacks form fields into a single column, and enlarges tap targets for buttons on small screens.

## Summary
Round 1 is a minimal proof-of-concept covering two fields with basic checks. Round 2 is production-oriented: broader field coverage, real-time feedback, accessible markup, stricter input constraints, and full responsive behavior — closing nearly every gap Round 1 leaves open.
