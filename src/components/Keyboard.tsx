interface KeyboardProps {
  guessedLetters: Set<string>;
  wrongGuesses: string[];
  onGuess: (letter: string) => void;
  disabled: boolean;
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function Keyboard({ guessedLetters, wrongGuesses, onGuess, disabled }: KeyboardProps) {
  return (
    <div className="keyboard">
      {LETTERS.map(letter => {
        const guessed = guessedLetters.has(letter);
        const wrong = wrongGuesses.includes(letter);
        const correct = guessed && !wrong;
        return (
          <button
            key={letter}
            className={`key${wrong ? ' wrong' : ''}${correct ? ' correct' : ''}`}
            onClick={() => onGuess(letter)}
            disabled={guessed || disabled}
            aria-label={`Guess ${letter.toUpperCase()}`}
          >
            {letter.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
