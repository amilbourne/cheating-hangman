import { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Gallows from './components/Gallows';
import WordDisplay from './components/WordDisplay';
import Keyboard from './components/Keyboard';

export default function App() {
  const {
    possibleWords, revealed, wrongGuesses,
    guessedLetters, status, message, guess, reset,
  } = useGameState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const letter = e.key.toLowerCase();
      if (/^[a-z]$/.test(letter) && status === 'playing' && !guessedLetters.has(letter)) {
        guess(letter);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guess, status, guessedLetters]);

  const mistakesLeft = 6 - wrongGuesses.length;

  return (
    <div className="app">
      <header>
        <h1>Cheating Hangman</h1>
        <p className="subtitle">Like playing hangman against a child</p>
      </header>

      <div className="game-area">
        <Gallows wrongCount={wrongGuesses.length} />

        <div className="right-panel">
          <WordDisplay revealed={revealed} />

          <p className={`message ${status}`}>{message}</p>

          {wrongGuesses.length > 0 && (
            <div className="wrong-guesses">
              <span className="wrong-label">Wrong: </span>
              {wrongGuesses.map(l => (
                <span key={l} className="wrong-letter">{l.toUpperCase()}</span>
              ))}
            </div>
          )}

          {status === 'playing' && (
            <p className="lives">
              {mistakesLeft} mistake{mistakesLeft !== 1 ? 's' : ''} remaining
            </p>
          )}

          <div className="cheat-meter">
            {status === 'playing' && possibleWords.length > 1 && (
              <small>I have {possibleWords.length} possible words to choose from&hellip;</small>
            )}
            {status === 'playing' && possibleWords.length === 1 && (
              <small>The computer has been cornered — only 1 word left!</small>
            )}
          </div>
        </div>
      </div>

      <Keyboard
        guessedLetters={guessedLetters}
        wrongGuesses={wrongGuesses}
        onGuess={guess}
        disabled={status !== 'playing'}
      />

      <button className="new-game-btn" onClick={reset}>
        {status === 'playing' ? 'New Game' : 'Play Again'}
      </button>
    </div>
  );
}
