# Cheating Hangman

A React single-page app implementing a devious variant of the classic hangman game — the computer doesn't actually commit to a word until it's forced to.

## How it works

When the game starts, the computer picks a **word length** rather than a specific word. It maintains a list of all possible words of that length. As the player guesses letters, the computer cheats:

- **If words exist that don't contain the guessed letter** — the computer discards all words that do contain it and tells the player the letter is wrong.
- **If all remaining words contain the guessed letter** — the computer is forced to accept it as correct. It groups the remaining words by the pattern of where the letter appears, picks the pattern covering the most words (to stay as ambiguous as possible), and reveals those positions.

This continues until the player reveals the full word (player wins) or accumulates 6 wrong guesses and is hanged (computer wins). The computer is cornered into committing to a specific word only when no ambiguity remains.

The UI shows how many possible words the computer is still juggling, making the cheating transparent and part of the fun.

## Word list

Words are drawn from the 100 most common English words, filtered to 4+ letters (~45 words across lengths 4–6).

## Tech stack

- [React 18](https://react.dev/) — UI
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Vite 8](https://vite.dev/) — dev server and bundler
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — tests

## Requirements

- Node.js 20.12 or later (24 recommended)

## Install

```bash
npm install
```

## Run development server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Output is written to `dist/`.

## Run tests

```bash
npm run test:run   # single pass
npm test           # watch mode
```
