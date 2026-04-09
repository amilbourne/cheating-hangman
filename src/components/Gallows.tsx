interface GallowsProps {
  wrongCount: number;
}

const STRUCTURE = '#6060a0';
const ROPE = '#8a7a5a';
const MAN = '#e8e8f0';

export default function Gallows({ wrongCount }: GallowsProps) {
  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      className="gallows"
      aria-label={`Hangman: ${wrongCount} of 6 parts drawn`}
    >
      {/* Gallows structure — always visible */}
      <line x1="10"  y1="245" x2="190" y2="245" stroke={STRUCTURE} strokeWidth="4" strokeLinecap="round" />
      <line x1="40"  y1="245" x2="40"  y2="20"  stroke={STRUCTURE} strokeWidth="4" strokeLinecap="round" />
      <line x1="40"  y1="20"  x2="140" y2="20"  stroke={STRUCTURE} strokeWidth="4" strokeLinecap="round" />
      <line x1="140" y1="20"  x2="140" y2="50"  stroke={ROPE}      strokeWidth="3" strokeLinecap="round" />

      {/* 1 — Head */}
      {wrongCount >= 1 && (
        <circle cx="140" cy="66" r="16" stroke={MAN} strokeWidth="3" fill="none" />
      )}
      {/* 2 — Body */}
      {wrongCount >= 2 && (
        <line x1="140" y1="82"  x2="140" y2="145" stroke={MAN} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* 3 — Left arm */}
      {wrongCount >= 3 && (
        <line x1="140" y1="100" x2="108" y2="128" stroke={MAN} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* 4 — Right arm */}
      {wrongCount >= 4 && (
        <line x1="140" y1="100" x2="172" y2="128" stroke={MAN} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* 5 — Left leg */}
      {wrongCount >= 5 && (
        <line x1="140" y1="145" x2="108" y2="183" stroke={MAN} strokeWidth="3" strokeLinecap="round" />
      )}
      {/* 6 — Right leg */}
      {wrongCount >= 6 && (
        <line x1="140" y1="145" x2="172" y2="183" stroke={MAN} strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
