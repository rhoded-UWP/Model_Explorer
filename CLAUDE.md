# Model Explorer — project rules

A React app for APC 440 (Web Development) that shows trending Hugging Face
text-generation models. It is a companion to the course weather app and follows
the same pattern: React + Vite, user input, data from a free public API, and
clear status messages.

The owner is learning React. Keep the code readable, comment the "why" (not
the "what"), and explain choices when reporting work.

## Stack
- React with Vite (React template), plain JavaScript. No TypeScript.
- Plain CSS in `src/styles.css`. No CSS frameworks, no CSS-in-JS.
- Don't add npm packages beyond what the Vite template installs unless asked.
  If one is added, say so and remind the owner to commit `package-lock.json`.

## What the app does
1. On page load, fetch the 10 trending text-generation models and show them as choices.
2. The user picks a model and presses "Show details".
3. The app fetches that model's details and shows them.

## Data (no API key; CORS allowed from localhost)
- Model list:
  `https://huggingface.co/api/models?pipeline_tag=text-generation&sort=trendingScore&limit=10`
  Returns an array. Fields used: `id` (e.g. "zai-org/GLM-5.3"), `likes`,
  `downloads`, `trendingScore`, `library_name`, `createdAt`, `tags`.
- One model's details: `https://huggingface.co/api/models/{id}`
  Put the id in the path exactly as the list returns it. Its "/" must stay a
  real slash (do NOT encodeURIComponent the whole id). Fields used: `id`,
  `author`, `downloads`, `likes`, `pipeline_tag`, `library_name`, `createdAt`,
  `lastModified`, `gated` (false, or a string like "auto"/"manual"),
  `cardData.license`, `safetensors.total` (parameter count), `siblings`
  (file list; show its length).
- Many fields are optional: `cardData`, `safetensors`, `library_name`, and
  `license` can be missing on any model. Show "Not listed" instead of crashing
  or showing "undefined".
- A model that doesn't exist returns HTTP 401 with
  `{"error": "Invalid username or password."}`, not 404. Treat any response
  that isn't `ok` as a failure.
- The trending list changes daily. Never hard-code model names.

## Components and responsibilities
- **App**: owns the model list, the selected model id, the details, and the status.
- **ModelPicker**: a `<select>` with a visible `<label>`, filled from the list,
  plus a "Show details" button. Disable the button while a request is in flight.
- **ModelDetails**: one model's information under an `h2` with the model id.
  Numbers via `toLocaleString()` (1707778 -> 1,707,778); parameter counts in a
  readable form (753329940480 -> "753B parameters"); dates via
  `toLocaleDateString()`. Link to `https://huggingface.co/{id}` with the text
  "View on Hugging Face".
- **TagList**: the model's tags rendered with `map()` and a stable key (the tag text).
- **StatusMessage**: loading, error, and prompt text in an `aria-live="polite"`
  region that is always on the page, even when empty.
- **Attribution**: "Model data from the Hugging Face Hub API" with a link to
  `https://huggingface.co`.

## Fetching and status
- Load the list in a `useEffect` with an empty dependency array (runs once).
  Include cleanup that ignores a late response if the component unmounts.
- Fetch details in the button's click handler, not on every `<select>` change.
- Use async/await with try/catch. Check `response.ok` and throw if false.
- Status values: `'loading-list'`, `'list-error'`, `'ready'`,
  `'loading-details'`, `'details-error'`, `'success'`. Messages:
  - list-error: "Models could not be loaded. Check your connection and refresh the page."
  - details-error: "Model details could not be loaded. Check your connection and try again."
- After any error, the user must be able to try again.
- Render all API text as plain JSX text. Never use `dangerouslySetInnerHTML`.

## Accessibility
- One `h1` ("Model Explorer") and a logical heading order.
- Every input has a visible label; every button has text.
- Everything works with the keyboard alone, with a visible focus outline.
- Status changes are announced through the aria-live region.
- Text meets WCAG AA contrast.

## Before reporting completion
- Run `npm run build` and fix any errors.
- Run the dev server and confirm the list loads and picking a model shows details.
- List which files were created and why.
- Explain each React concept used (useState, useEffect, props, map with key,
  controlled `<select>`) in one or two plain sentences.
- Don't commit or push until asked.
