import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGameState, groupByPattern } from './useGameState';

// Controlled word list: all 4-letter, all share 'a'(pos1) 't'(pos2) 'e'(pos3),
// differ only at pos0. Makes test scenarios deterministic.
vi.mock('../data/words', () => ({
  WORD_LIST: ['hate', 'late', 'gate', 'fate', 'mate', 'rate'],
}));

// ─── Pure function tests ────────────────────────────────────────────────────

describe('groupByPattern', () => {
  it('groups words by where the letter appears', () => {
    const groups = groupByPattern(
      ['able', 'cake', 'cave', 'came'],
      'a',
      [null, null, null, null],
    );
    expect(groups['a___']).toEqual(['able']);
    expect(groups['_a__']).toEqual(['cake', 'cave', 'came']);
  });

  it('incorporates already-revealed letters into the key', () => {
    // revealed[1] = 'a'; guessing 'k'
    const groups = groupByPattern(['cake', 'cave'], 'k', [null, 'a', null, null]);
    // cake: c→_ a(revealed)→a k→k e→_  ⇒ '_ak_'
    // cave: c→_ a(revealed)→a v→_  e→_  ⇒ '_a__'
    expect(groups['_ak_']).toEqual(['cake']);
    expect(groups['_a__']).toEqual(['cave']);
  });

  it('picks the group with the most words when used in reduce', () => {
    const groups = groupByPattern(
      ['able', 'cake', 'cave', 'came'],
      'a',
      [null, null, null, null],
    );
    const bestKey = Object.keys(groups).reduce((a, b) =>
      groups[a].length >= groups[b].length ? a : b,
    );
    expect(bestKey).toBe('_a__');
    expect(groups[bestKey]).toHaveLength(3);
  });
});

// ─── Hook integration tests ─────────────────────────────────────────────────

describe('useGameState', () => {
  beforeEach(() => {
    // Makes pickRandom always return arr[0] — deterministic
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initialises with the correct structure', () => {
    const { result } = renderHook(() => useGameState());
    expect(result.current.status).toBe('playing');
    expect(result.current.revealed).toEqual([null, null, null, null]);
    expect(result.current.wrongGuesses).toEqual([]);
    expect(result.current.possibleWords).toHaveLength(6);
    expect(result.current.guessedLetters.size).toBe(0);
  });

  it('marks a letter as wrong when words without it exist', () => {
    const { result } = renderHook(() => useGameState());
    act(() => { result.current.guess('z'); }); // 'z' absent from all 6 words
    expect(result.current.wrongGuesses).toEqual(['z']);
    expect(result.current.guessedLetters.has('z')).toBe(true);
    expect(result.current.status).toBe('playing');
    expect(result.current.possibleWords).toHaveLength(6);
  });

  it('filters possibleWords to those without the wrong letter', () => {
    const { result } = renderHook(() => useGameState());
    // 'h' only appears in 'hate', so guessing 'h' → 5 words remain
    act(() => { result.current.guess('h'); });
    expect(result.current.wrongGuesses).toContain('h');
    expect(result.current.possibleWords).toHaveLength(5);
    expect(result.current.possibleWords).not.toContain('hate');
  });

  it('ignores a duplicate guess', () => {
    const { result } = renderHook(() => useGameState());
    act(() => { result.current.guess('z'); });
    act(() => { result.current.guess('z'); });
    expect(result.current.wrongGuesses).toEqual(['z']);
  });

  it('marks the game as lost after 6 wrong guesses and reveals the word', () => {
    const { result } = renderHook(() => useGameState());
    // b,c,d,i,j,k are absent from all 6 words
    ['b', 'c', 'd', 'i', 'j', 'k'].forEach(letter => {
      act(() => { result.current.guess(letter); });
    });
    expect(result.current.status).toBe('lost');
    expect(result.current.wrongGuesses).toHaveLength(6);
    expect(result.current.revealed.every(l => l !== null)).toBe(true);
  });

  it('forces a correct guess when all remaining words contain the letter', () => {
    const { result } = renderHook(() => useGameState());
    // All 6 words have 'a' at position 1
    act(() => { result.current.guess('a'); });
    expect(result.current.wrongGuesses).toHaveLength(0);
    expect(result.current.revealed).toEqual([null, 'a', null, null]);
    expect(result.current.status).toBe('playing');
  });

  it('keeps the most words alive when choosing a pattern on a forced correct', () => {
    const { result } = renderHook(() => useGameState());
    // Narrow to 5 words by eliminating 'hate' (only word with 'h')
    act(() => { result.current.guess('h'); });
    expect(result.current.possibleWords).toHaveLength(5);
    // All 5 remaining share the same 'a' pattern → still 5 possible words after force-accept
    act(() => { result.current.guess('a'); });
    expect(result.current.revealed[1]).toBe('a');
    expect(result.current.possibleWords).toHaveLength(5);
  });

  it('marks the game as won when all letters are revealed', () => {
    const { result } = renderHook(() => useGameState());
    // Force 'a' correct → revealed = [null,'a',null,null]
    act(() => { result.current.guess('a'); });
    // Eliminate words until only 'rate' remains
    ['h', 'l', 'g', 'f', 'm'].forEach(letter => {
      act(() => { result.current.guess(letter); });
    });
    expect(result.current.possibleWords).toEqual(['rate']);
    // Force-reveal the remaining letters
    act(() => { result.current.guess('r'); });
    act(() => { result.current.guess('t'); });
    act(() => { result.current.guess('e'); });
    expect(result.current.status).toBe('won');
    expect(result.current.revealed).toEqual(['r', 'a', 't', 'e']);
  });

  it('ignores guesses after the game is over', () => {
    const { result } = renderHook(() => useGameState());
    act(() => { result.current.guess('a'); });
    ['h', 'l', 'g', 'f', 'm'].forEach(letter => {
      act(() => { result.current.guess(letter); });
    });
    act(() => { result.current.guess('r'); });
    act(() => { result.current.guess('t'); });
    act(() => { result.current.guess('e'); });
    expect(result.current.status).toBe('won');
    const wrongsBefore = result.current.wrongGuesses.length;
    act(() => { result.current.guess('z'); });
    expect(result.current.wrongGuesses).toHaveLength(wrongsBefore);
  });

  it('resets to a fresh state', () => {
    const { result } = renderHook(() => useGameState());
    act(() => { result.current.guess('z'); });
    act(() => { result.current.reset(); });
    expect(result.current.wrongGuesses).toEqual([]);
    expect(result.current.revealed).toEqual([null, null, null, null]);
    expect(result.current.status).toBe('playing');
    expect(result.current.guessedLetters.size).toBe(0);
  });
});
