import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Gallows from './Gallows';

describe('Gallows', () => {
  it('renders the correct aria-label', () => {
    const { getByRole } = render(<Gallows wrongCount={3} />);
    expect(getByRole('img', { name: 'Hangman: 3 of 6 parts drawn' })).toBeInTheDocument();
  });

  it('shows no body parts when wrongCount is 0', () => {
    const { container } = render(<Gallows wrongCount={0} />);
    expect(container.querySelector('circle')).toBeNull();
    // 4 structural lines: base, pole, beam, rope
    expect(container.querySelectorAll('line')).toHaveLength(4);
  });

  it('shows just the head at wrongCount 1', () => {
    const { container } = render(<Gallows wrongCount={1} />);
    expect(container.querySelector('circle')).not.toBeNull();
    expect(container.querySelectorAll('line')).toHaveLength(4); // no body lines yet
  });

  it('shows all 6 parts at wrongCount 6', () => {
    const { container } = render(<Gallows wrongCount={6} />);
    expect(container.querySelector('circle')).not.toBeNull();
    // 4 structural + 5 body lines (body, left arm, right arm, left leg, right leg)
    expect(container.querySelectorAll('line')).toHaveLength(9);
  });
});
