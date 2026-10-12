# Model Explorer

A React + Vite app for APC 440 that lists today's ten trending Hugging Face
text-generation models and shows details for the one you pick.

Data comes from the free, public [Hugging Face Hub API](https://huggingface.co)
(no API key needed).

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run lint     # check the code with oxlint
```

## Project layout

- `src/App.jsx`: owns all state (list, selection, details, status) and does the fetching
- `src/components/`: ModelPicker, ModelDetails, TagList, StatusMessage, Attribution
- `src/format.js`: helpers that format numbers, dates, and sizes, and show "Not listed" for missing data
- `src/styles.css`: all styles (plain CSS)

Project rules for AI-assisted sessions are in `CLAUDE.md`.
