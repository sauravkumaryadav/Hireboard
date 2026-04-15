// Empty state display component
export default function EmptyState({ message }) {
  return <div>{message || 'No data found'}</div>;
}
