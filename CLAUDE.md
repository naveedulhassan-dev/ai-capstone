# Project Instructions

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Tailwind CSS

## Code Conventions

- Use semantic HTML.
- Use modern JavaScript.
- Use meaningful variable and function names.
- Keep code clean, readable, and maintainable.
- Use Tailwind CSS for styling.
- Keep the interface responsive.

## General Rules

- Do not add unnecessary dependencies.
- Prefer simple and maintainable solutions.
- Keep the project structure organized.
- Explain important changes before implementing them.

## 1. Keep HTML, CSS, and JS in separate files — never inline
Round 1 mixed `<style>` and `<script>` directly into the HTML, which made the code harder to maintain and violated separation of concerns. Always create `*.html`, `*.css`, and `*.js` as distinct files and link them properly (`<link rel="stylesheet">`, `<script src="...">`). Never use inline `onclick=` handlers — always `addEventListener()`.

## 2. Every input needs real-time validation, not just submit-time validation
Round 1 only validated on `submit`, so a fixed field kept showing its error until the next click. Every field should re-validate on its own `input`/`change` event and clear its error the moment it becomes valid. Trim whitespace before checking length so padded strings (`"ab "`) can't slip past a minimum-length rule.

## 3. Pair every error message with a matching `is-invalid`/`is-valid` class on the input
Text-only errors (Round 1's approach) are easy to miss. Toggle a class on the input itself so the border/box-shadow changes too — this gives the user two signals (color + text) for the same problem, and gives us a reliable CSS hook (`.is-invalid`) for styling instead of manual `style.display` toggles.