interface WordDisplayProps {
  revealed: (string | null)[];
}

export default function WordDisplay({ revealed }: WordDisplayProps) {
  return (
    <div className="word-display">
      {revealed.map((letter, i) => (
        <span key={i} className="letter-slot">
          <span className="letter">{letter?.toUpperCase() ?? ''}</span>
          <span className="underline" />
        </span>
      ))}
    </div>
  );
}
