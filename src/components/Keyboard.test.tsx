import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Keyboard from './Keyboard';

const noop = () => {};

describe('Keyboard', () => {
  it('renders 26 letter buttons', () => {
    const { getAllByRole } = render(
      <Keyboard guessedLetters={new Set()} wrongGuesses={[]} onGuess={noop} disabled={false} />,
    );
    expect(getAllByRole('button')).toHaveLength(26);
  });

  it('disables a button once its letter has been guessed', () => {
    const { getByLabelText } = render(
      <Keyboard guessedLetters={new Set(['a'])} wrongGuesses={[]} onGuess={noop} disabled={false} />,
    );
    expect(getByLabelText('Guess A')).toBeDisabled();
  });

  it('applies the wrong class to incorrect guesses', () => {
    const { getByLabelText } = render(
      <Keyboard guessedLetters={new Set(['a'])} wrongGuesses={['a']} onGuess={noop} disabled={false} />,
    );
    expect(getByLabelText('Guess A')).toHaveClass('wrong');
  });

  it('applies the correct class to correct guesses', () => {
    const { getByLabelText } = render(
      // 'a' guessed but NOT in wrongGuesses → it was correct
      <Keyboard guessedLetters={new Set(['a'])} wrongGuesses={[]} onGuess={noop} disabled={false} />,
    );
    expect(getByLabelText('Guess A')).toHaveClass('correct');
  });

  it('calls onGuess with the lowercase letter when clicked', () => {
    const onGuess = vi.fn();
    const { getByLabelText } = render(
      <Keyboard guessedLetters={new Set()} wrongGuesses={[]} onGuess={onGuess} disabled={false} />,
    );
    fireEvent.click(getByLabelText('Guess B'));
    expect(onGuess).toHaveBeenCalledWith('b');
  });

  it('disables all buttons when the disabled prop is true', () => {
    const { getAllByRole } = render(
      <Keyboard guessedLetters={new Set()} wrongGuesses={[]} onGuess={noop} disabled={true} />,
    );
    getAllByRole('button').forEach(btn => expect(btn).toBeDisabled());
  });
});
