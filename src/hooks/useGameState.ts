import { useState, useCallback } from 'react';
import { WORD_LIST } from '../data/words';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  possibleWords: string[];
  revealed: (string | null)[];
  wrongGuesses: string[];
  guessedLetters: Set<string>;
  status: GameStatus;
  message: string;
}

const MAX_WRONG = 6;

export function groupByPattern(
  words: string[],
  letter: string,
  revealed: (string | null)[],
): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const word of words) {
    const key = word
      .split('')
      .map((c, i) => (c === letter ? letter : (revealed[i] ?? '_')))
      .join('');
    if (!groups[key]) groups[key] = [];
    groups[key].push(word);
  }
  return groups;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildInitialState(): GameState {
  const lengths = [...new Set(WORD_LIST.map(w => w.length))];
  const validLengths = lengths.filter(
    len => WORD_LIST.filter(w => w.length === len).length >= 3,
  );
  const wordLength = pickRandom(validLengths.length > 0 ? validLengths : lengths);
  const possibleWords = WORD_LIST.filter(w => w.length === wordLength);
  return {
    possibleWords,
    revealed: Array<null>(wordLength).fill(null),
    wrongGuesses: [],
    guessedLetters: new Set(),
    status: 'playing',
    message: `I'm thinking of a ${wordLength}-letter word. Start guessing!`,
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(buildInitialState);

  const guess = useCallback((letter: string) => {
    setState(prev => {
      if (prev.status !== 'playing' || prev.guessedLetters.has(letter)) return prev;

      const newGuessed = new Set(prev.guessedLetters);
      newGuessed.add(letter);

      const wordsWithout = prev.possibleWords.filter(w => !w.includes(letter));

      if (wordsWithout.length > 0) {
        // Letter is wrong — discard all words that contain it
        const newWrong = [...prev.wrongGuesses, letter];
        const lost = newWrong.length >= MAX_WRONG;

        if (lost) {
          const finalWord = pickRandom(wordsWithout);
          return {
            ...prev,
            possibleWords: [finalWord],
            wrongGuesses: newWrong,
            guessedLetters: newGuessed,
            revealed: finalWord.split('').map((c, i) => prev.revealed[i] ?? c),
            status: 'lost',
            message: `You've been hanged! I was thinking of "${finalWord}".` + (wordsWithout.length !== 1 ? `(Or was I? I had ${wordsWithout.length} choices)` : '')
          };
        }

        return {
          ...prev,
          possibleWords: wordsWithout,
          wrongGuesses: newWrong,
          guessedLetters: newGuessed,
          message: `No "${letter.toUpperCase()}"s in my word.`,
        };
      }

      // Forced to accept — group remaining words by where the letter appears,
      // then pick the largest group (keeps the most options alive).
      const groups = groupByPattern(prev.possibleWords, letter, prev.revealed);
      const bestKey = Object.keys(groups).reduce((a, b) =>
        groups[a].length >= groups[b].length ? a : b,
      );
      const bestWords = groups[bestKey];

      const newRevealed = prev.revealed.map((r, i) => {
        if (r !== null) return r;
        return bestKey[i] === letter ? letter : null;
      });

      const won = newRevealed.every(l => l !== null);

      let message: string;
      if (won) {
        message = `You win! The word is "${newRevealed.join('')}"!`;
      } else {
        const positions = newRevealed
          .map((l, i) => (l === letter ? i + 1 : null))
          .filter((p): p is number => p !== null);
        message = `Yes! "${letter.toUpperCase()}" is in the word at position${positions.length > 1 ? 's' : ''} ${positions.join(', ')}`;
      }

      return {
        ...prev,
        possibleWords: bestWords,
        revealed: newRevealed,
        guessedLetters: newGuessed,
        status: won ? 'won' : 'playing',
        message,
      };
    });
  }, []);

  const reset = useCallback(() => setState(buildInitialState()), []);

  return { ...state, guess, reset };
}
