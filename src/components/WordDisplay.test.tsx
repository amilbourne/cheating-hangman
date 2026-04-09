import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WordDisplay from './WordDisplay';

describe('WordDisplay', () => {
  it('renders one slot per position', () => {
    const { container } = render(<WordDisplay revealed={[null, null, null, null]} />);
    expect(container.querySelectorAll('.letter-slot')).toHaveLength(4);
  });

  it('shows revealed letters in uppercase', () => {
    const { getByText } = render(<WordDisplay revealed={['h', null, 't']} />);
    expect(getByText('H')).toBeInTheDocument();
    expect(getByText('T')).toBeInTheDocument();
  });

  it('leaves blank slots empty for null positions', () => {
    const { container } = render(<WordDisplay revealed={[null, 'a', null]} />);
    const letters = container.querySelectorAll('.letter');
    expect(letters[0].textContent).toBe('');
    expect(letters[1].textContent).toBe('A');
    expect(letters[2].textContent).toBe('');
  });
});
